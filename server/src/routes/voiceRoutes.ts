import express from "express"
import multer from "multer"
import fs from "fs"
import dotenv from "dotenv"
import FormData from "form-data"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Opportunity from "../models/Opportunity"

dotenv.config()

const router = express.Router()
const upload = multer({ dest: "uploads/" })
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// ── Parse transcript into structured opportunity fields via Gemini ─────────────
async function parseTranscriptWithGemini(transcript: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `You are parsing a volunteer opportunity description spoken aloud by a nonprofit.
Extract the following fields and return ONLY valid JSON — no markdown, no explanation, no backticks.

Transcript: "${transcript}"

Return exactly this JSON shape:
{
  "title": "short role title e.g. 'Math Tutor' or 'Food Bank Helper'",
  "causeArea": "one of: Education, Environment, Health, Community, Arts, Animals, Seniors, Youth, Other",
  "description": "clean 2-3 sentence summary of the opportunity",
  "requiredSkills": ["skill1", "skill2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "commitmentType": "one of: Weekly, One-time, Flexible",
  "location": "city or neighbourhood mentioned, default to 'Vancouver' if not mentioned",
  "isRemote": false
}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  try {
    const clean = raw.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
  } catch {
    return {
      title: "Volunteer Opportunity",
      causeArea: "Other",
      description: transcript,
      requiredSkills: [],
      responsibilities: [],
      commitmentType: "Flexible",
      location: "Vancouver",
      isRemote: false,
    }
  }
}

// ── POST /api/opportunities/voice ─────────────────────────────────────────────
router.post("/voice", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded." })
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ message: "ELEVENLABS_API_KEY missing in .env" })
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY missing in .env" })
    }

    // STEP 1 — Send audio to ElevenLabs speech-to-text
    // Rename temp file to .webm so ElevenLabs recognises the format
    const renamedPath = req.file.path + ".webm"
    fs.renameSync(req.file.path, renamedPath)

    const formData = new FormData()
    formData.append("file", fs.createReadStream(renamedPath), {
      filename: "recording.webm",
      contentType: "audio/webm",
    })
    formData.append("model_id", "scribe_v1")

    const elevenRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        ...formData.getHeaders(),
      },
      body: formData as any,
    })

    const elevenData = await elevenRes.json()

    if (!elevenRes.ok) {
      throw new Error(elevenData?.detail || "ElevenLabs transcription failed")
    }

    const transcript: string = elevenData.text || ""
    if (!transcript.trim()) {
      return res.status(400).json({ message: "Could not transcribe audio. Please speak clearly and try again." })
    }

    // STEP 2 — Gemini extracts structured fields from transcript
    const parsed = await parseTranscriptWithGemini(transcript)

    // STEP 3 — Save to MongoDB using your Opportunity model
    const opportunity = await Opportunity.create({
      title: parsed.title,
      causeArea: parsed.causeArea,
      description: parsed.description,
      requiredSkills: parsed.requiredSkills,
      responsibilities: parsed.responsibilities,
      commitmentType: parsed.commitmentType,
      location: parsed.location,
      isRemote: parsed.isRemote,
    })

    // Cleanup temp upload file
    fs.unlinkSync(renamedPath)

    return res.status(201).json({
      message: "Opportunity saved successfully",
      transcript,
      opportunity,
    })
  } catch (error) {
    console.error("Voice route error:", error)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(renamedPath)
    }
    return res.status(500).json({
      message: "Failed to process audio",
      error: String(error),
    })
  }
})

export default router