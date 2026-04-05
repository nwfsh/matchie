import { Router, Request, Response } from 'express'
import { connectDB } from '../config/db'
import StudentProfile from '../models/students/StudentProfile'

const router = Router()

// POST /api/students/profile
router.post('/', async (req: Request, res: Response) => {
    try {
        await connectDB()

        const { clerkId, name, age, school, language, experience, hoursPerYear } = req.body

        if (!clerkId || !name || !age) {
            return res.status(400).json({ error: 'clerkId, name and age are required' })
        }

        // Upsert — safe to call again if student somehow resubmits
        const profile = await StudentProfile.findOneAndUpdate(
            { clerkId },
            { clerkId, name, age: Number(age), school, language, experience, hoursPerYear },
            { upsert: true, new: true }
        )

        return res.status(201).json({ profileId: profile._id })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error' })
    }
})

export default router