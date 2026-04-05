import { Router, Request, Response } from 'express'
import { connectDB } from '../config/db'
import StudentQuiz from '../models/students/StudentQuiz'
import StudentProfile from '../models/students/StudentProfile'

const router = Router()

// POST /api/students/quiz
router.post('/', async (req: Request, res: Response) => {
    try {
        await connectDB()

        const { clerkId, cause, goal, energy, social, task, skills, availability, onboarding } = req.body

        if (!clerkId) {
            return res.status(400).json({ error: 'clerkId is required' })
        }

        // Find the profile this quiz belongs to
        const profile = await StudentProfile.findOne({ clerkId })
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found — complete onboarding first' })
        }

        // Upsert so resubmitting the quiz just updates rather than duplicates
        const quiz = await StudentQuiz.findOneAndUpdate(
            { profileId: profile._id },
            {
                profileId: profile._id,
                cause,
                goal,
                energy,
                social,
                task,
                skills,
                availability,
                onboarding,
                completedAt: new Date(),
            },
            { upsert: true, returnDocument: 'after' }
        )

        return res.status(201).json({ quizId: quiz._id })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error' })
    }
})

export default router