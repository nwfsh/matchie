'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import styles from './onboarding.module.css'

type FormState = {
    name: string
    age: string
    school: string
    language: string
    experience: string
    hoursPerYear: string
}

const INITIAL_FORM: FormState = {
    name: '',
    age: '',
    school: '',
    language: 'English',
    experience: 'none',
    hoursPerYear: '',
}

export default function Onboarding() {
    const router = useRouter()
    const { user } = useUser()
    const [form, setForm] = useState<FormState>(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const canProceed = form.name.trim() !== '' && form.age !== ''

    const handleSubmit = async () => {
        if (!canProceed || !user) return
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clerkId: user.id,
                    name: form.name,
                    age: Number(form.age),
                    school: form.school,
                    language: form.language,
                    experience: form.experience,
                    hoursPerYear: form.hoursPerYear ? Number(form.hoursPerYear) : undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Something went wrong')
                return
            }

            // Store profileId for quiz to use
            localStorage.setItem('profileId', data.profileId)
            router.push('/student/quiz')

        } catch (err) {
            setError('Could not connect to server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.page}>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '25%' }} />
            </div>

            {/* Nav row */}
            <div className={styles.nav}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    ← Back
                </button>
                <span>Step 1 of 3</span>
            </div>

            <div className={styles.card}>
                <span className={styles.emoji}>🌱</span>

                <h1 className={styles.heading}>Let's get started!</h1>
                <p className={styles.subheading}>Tell us a bit about yourself 🌿</p>

                <div className={styles.fields}>

                    <div className={styles.field}>
                        <label className={styles.label}>Full Name *</label>
                        <input
                            className={styles.input}
                            name="name"
                            placeholder="Jamie Rivera"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Age *</label>
                        <input
                            className={styles.input}
                            name="age"
                            type="number"
                            placeholder="e.g. 16"
                            value={form.age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            School <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                            className={styles.input}
                            name="school"
                            placeholder="Lincoln High School"
                            value={form.school}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Preferred Language</label>
                        <select
                            className={styles.select}
                            name="language"
                            value={form.language}
                            onChange={handleChange}
                        >
                            <option>English</option>
                            <option>French</option>
                            <option>Mandarin</option>
                            <option>Cantonese</option>
                            <option>Punjabi</option>
                            <option>Spanish</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Volunteering Experience</label>
                        <select
                            className={styles.select}
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                        >
                            <option value="none">Never volunteered before</option>
                            <option value="once">Done it once or twice</option>
                            <option value="some">A few times</option>
                            <option value="regular">I volunteer regularly</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Hours you want to aim for volunteering this year</label>
                        <input
                            className={styles.input}
                            name="hoursPerYear"
                            type="number"
                            placeholder="e.g. 30"
                            value={form.hoursPerYear}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={`${styles.submitBtn} ${canProceed && !loading ? styles.active : styles.disabled}`}
                    onClick={handleSubmit}
                    disabled={!canProceed || loading}
                >
                    {loading ? 'Saving...' : 'Next: Take the Quiz →'}
                </button>
            </div>

        </main>
    )
}