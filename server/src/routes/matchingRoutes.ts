import { Router, Request, Response } from 'express'
import axios from 'axios'
import Groq from 'groq-sdk'
import StudentQuiz from '../models/students/StudentQuiz'
import StudentProfile from '../models/students/StudentProfile'
import Opportunity from '../models/Opportunity'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Convert quiz answers into a natural language personality paragraph 
function buildStudentParagraph(quiz: any): string {
  const causeMap: Record<string, string> = {
    people: 'helping people like seniors, kids, families and newcomers',
    environment: 'environmental causes like nature, animals and sustainability',
    arts: 'arts and culture like events and creative community work',
    education: 'education like tutoring, mentoring and literacy',
    unsure: 'any cause they find meaningful',
  }

    const goalMap: Record<string, string> = {
        hours: 'completing their graduation volunteer hours',
        resume: 'building their resume and university applications',
        skills: 'learning and growing through real-world experience',
        community: 'genuinely giving back and making a difference',
    }
  const energyMap: Record<string, string> = {
    chill: 'a chill and low-key environment with no pressure',
    moderate: 'a steady and manageable pace',
    'fast-paced': 'a busy and exciting fast-paced environment',
  }
  const socialMap: Record<string, string> = {
    solo: 'working independently on their own',
    small: 'working in a small close-knit group',
    big: 'working in a big group and meeting lots of new people',
  }
  const taskMap: Record<string, string> = {
    people: 'talking and helping people directly',
    creative: 'creative tasks like art, design and content',
    background: 'behind the scenes work like organizing and sorting',
    physical: 'hands-on physical and outdoor tasks',
  }
  const onboardingMap: Record<string, string> = {
    'jump-in': 'jumping straight in and figuring things out as they go',
    light: 'a quick rundown before starting',
    structured: 'proper structured training before beginning',
    depends: 'flexible onboarding depending on the role',
  }

    const causes = (quiz.cause as string[]).map(c => causeMap[c] || c).join(' and ')
    const skills = (quiz.skills as string[]).join(', ')
    const availability = (quiz.availability as string[]).join(', ')
    const goals = Array.isArray(quiz.goal)
        ? (quiz.goal as string[]).map(g => goalMap[g] || g).join(' and ')
        : goalMap[quiz.goal] || quiz.goal

    let paragraph = `This volunteer is passionate about ${causes}. 
Their main goal is ${goals}.
They prefer ${energyMap[quiz.energy] || quiz.energy} and enjoy ${socialMap[quiz.social] || quiz.social}. 
They are best suited to ${taskMap[quiz.task] || quiz.task}. 
They want to build skills in ${skills}. 
They are available ${availability}. 
They prefer ${onboardingMap[quiz.onboarding] || quiz.onboarding}.`

    if (quiz.cause_extra) paragraph += `\nMore about their cause interests: ${quiz.cause_extra}`
    if (quiz.goal_extra) paragraph += `\nMore about their goals: ${quiz.goal_extra}`
    if (quiz.skills_extra) paragraph += `\nMore about their skills: ${quiz.skills_extra}`

    return paragraph
}

// Convert opportunity into a natural language paragraph 
function buildOpportunityParagraph(opp: any): string {
  const skillsList = opp.requiredSkills?.join(', ') || 'general volunteering skills'
  const responsibilities = opp.responsibilities?.join(', ') || opp.description
  const remote = opp.isRemote ? 'This is a remote opportunity.' : `This is based in ${opp.location}.`

  return `This is a ${opp.commitmentType} volunteer opportunity in the ${opp.causeArea} sector titled "${opp.title}". 
${opp.description} 
Volunteers will be responsible for: ${responsibilities}. 
Required skills include: ${skillsList}. 
${remote}`
}

// Get Nomic embeddings 
async function getEmbedding(text: string): Promise<number[]> {
  const response = await axios.post(
    'https://api-atlas.nomic.ai/v1/embedding/text',
    {
      texts: [text],
      model: 'nomic-embed-text-v1.5',
      task_type: 'search_query',
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NOMIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data.embeddings[0]
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))
  if (!magA || !magB) return 0
  return dot / (magA * magB)
}

// Generate a human-readable match explanation via Groq 
async function generateMatchReason(
  studentParagraph: string,
  oppParagraph: string,
  matchPct: number
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 80,
    messages: [
      {
        role: 'user',
        content: `You are a volunteer matching assistant. Based on the student profile and opportunity below, write ONE short sentence (max 20 words) explaining why this is a ${matchPct}% match. Be specific and encouraging. No intro, just the sentence.

Student: ${studentParagraph}

Opportunity: ${oppParagraph}`,
      },
    ],
  })
  return completion.choices[0]?.message?.content?.trim() || 'Great personality and interest match.'
}

// GET /api/matching/:clerkId 
router.get('/:clerkId', async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.params

   
    const profile = await StudentProfile.findOne({ clerkId })
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Complete onboarding first.' })
    }

    const quiz = await StudentQuiz.findOne({ profileId: profile._id })
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found. Complete the quiz first.' })
    }


    const studentParagraph = buildStudentParagraph(quiz)
    console.log('Student paragraph:', studentParagraph)

    const studentEmbedding = await getEmbedding(studentParagraph)


    const opportunities = await Opportunity.find()
    if (opportunities.length === 0) {
      return res.json({ matches: [] })
    }

    // Score each opportunity by cosine similarity
    const scored = await Promise.all(
      opportunities.map(async (opp) => {
        const oppParagraph = buildOpportunityParagraph(opp)
        const oppEmbedding = await getEmbedding(oppParagraph)
        const similarity = cosineSimilarity(studentEmbedding, oppEmbedding)
        const matchPercentage = Math.round(similarity * 100)
        return { opportunity: opp, oppParagraph, matchPercentage }
      })
    )

    
    const top5 = scored
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5)

    const matchesWithReasons = await Promise.all(
      top5.map(async ({ opportunity, oppParagraph, matchPercentage }) => {
        const reason = await generateMatchReason(studentParagraph, oppParagraph, matchPercentage)
        return { opportunity, matchPercentage, reason }
      })
    )

    return res.json({ matches: matchesWithReasons })
  } catch (err: any) {
    console.error('Matching error:', err?.response?.data || err)
    return res.status(500).json({ error: 'Matching failed', detail: String(err) })
  }
})

export default router