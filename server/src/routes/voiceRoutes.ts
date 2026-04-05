import express from "express"
import multer from "multer"
import fs from "fs"
import dotenv from "dotenv"
import FormData from "form-data"
import axios from "axios"
import Groq from "groq-sdk"
import Opportunity from "../models/Opportunity"

dotenv.config()

const router = express.Router()
const upload = multer({ dest: "uploads/" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ── Parse transcript into structured opportunity fields via Groq ──────────────
async function parseTranscriptWithGroq(transcript: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are parsing a volunteer opportunity description spoken aloud by a nonprofit.
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
}`,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ""
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
  let renamedPath: string | null = null

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded." })
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ message: "ELEVENLABS_API_KEY missing in .env" })
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY missing in .env" })
    }

    // STEP 1 — Rename temp file to .webm so ElevenLabs recognises the format
    renamedPath = req.file.path + ".webm"
    fs.renameSync(req.file.path, renamedPath)

    const formData = new FormData()
    formData.append("file", fs.createReadStream(renamedPath), {
      filename: "recording.webm",
      contentType: "audio/webm",
    })
    formData.append("model_id", "scribe_v1")

    // axios handles multipart correctly with node form-data
    const elevenRes = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text",
      formData,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          ...formData.getHeaders(),
        },
      }
    )

    const transcript: string = elevenRes.data?.text || ""
    if (!transcript.trim()) {
      return res.status(400).json({ message: "Could not transcribe audio. Please speak clearly and try again." })
    }

    console.log("TRANSCRIPT:", transcript)

    // STEP 2 — Groq extracts structured fields from transcript
    const parsed = await parseTranscriptWithGroq(transcript)
    console.log("PARSED:", parsed)

    // STEP 3 — Save to MongoDB
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

    fs.unlinkSync(renamedPath)

    return res.status(201).json({
      message: "Opportunity saved successfully",
      transcript,
      opportunity,
    })
  } catch (error: any) {
    console.error("Voice route error:", error?.response?.data || error)
    if (renamedPath && fs.existsSync(renamedPath)) {
      fs.unlinkSync(renamedPath)
    }
    return res.status(500).json({
      message: "Failed to process audio",
      error: error?.response?.data || String(error),
    })
  }
  
})
// Add this route to your existing opportunityRoutes file, just before `export default router`
// It reuses parseTranscriptWithGroq since text and transcript are treated identically.

// ── POST /api/opportunities/text ──────────────────────────────────────────────
router.post("/text", async (req, res) => {
  try {
    const { description } = req.body

    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: "No description provided." })
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY missing in .env" })
    }

    const transcript = String(description).trim()

    // Reuse the same Groq extractor — text input is treated like a transcript
    const parsed = await parseTranscriptWithGroq(transcript)
    console.log("TEXT PARSED:", parsed)

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

    return res.status(201).json({
      message: "Opportunity saved successfully",
      transcript,       // echoed back so the UI can show "What we received"
      opportunity,
    })
  } catch (error: any) {
    console.error("Text route error:", error)
    return res.status(500).json({
      message: "Failed to process description",
      error: String(error),
    })
  }
})
export default router