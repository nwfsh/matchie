import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export type Profile = {
    name: string
    school?: string
    hoursPerYear?: number
    language?: string
    experience?: string
}

export type Quiz = {
    cause?: string[]
    skills?: string[]
    availability?: string[]
    energy?: string
    task?: string
    goal?: string
    social?: string
    onboarding?: string
}

export type Certificate = {
    title: string
    issuedAt: string
    issuer?: string
}

export type Progress = {
    hoursCompleted: number
    certificates: Certificate[]
}

export function useDashboard() {
    const { user } = useUser()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [progress, setProgress] = useState<Progress | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/students/profile/me?clerkId=${user.id}`
                )
                const data = await res.json()
                if (res.ok) {
                    setProfile(data.profile)
                    setQuiz(data.quiz)
                    setProgress(data.progress)
                }
            } catch (err) {
                console.error('Failed to fetch student data', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    const hoursCompleted = progress?.hoursCompleted ?? 0
    const hoursGoal = profile?.hoursPerYear ?? 40
    const pct = Math.min(Math.round((hoursCompleted / hoursGoal) * 100), 100)
    const firstName = profile?.name?.split(' ')[0] ?? ''
    const certificates = progress?.certificates ?? []

    return {
        profile,
        quiz,
        progress,
        loading,
        hoursCompleted,
        hoursGoal,
        pct,
        firstName,
        certificates,
    }
}