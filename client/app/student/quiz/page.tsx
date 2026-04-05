'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import styles from './quiz.module.css'

const questions = [
    {
        id: 'cause',
        question: 'What kind of cause speaks to you?',
        hint: 'Pick all that apply',
        multi: true,
        options: [
            { value: 'people', label: 'Helping people', sub: 'Seniors, kids, families, newcomers' },
            { value: 'environment', label: 'Environment', sub: 'Nature, animals, sustainability' },
            { value: 'arts', label: 'Arts & culture', sub: 'Events, creativity, community' },
            { value: 'education', label: 'Education', sub: 'Tutoring, mentoring, literacy' },
            { value: 'unsure', label: 'Not sure yet', sub: "I'm open to anything" },
        ],
    },
    {
        id: 'goal',
        question: 'What do you most want to get out of this?',
        hint: 'Be honest — there are no wrong answers',
        multi: false,
        options: [
            { value: 'hours', label: 'Grad hours', sub: 'Hit my graduation requirement' },
            { value: 'resume', label: 'Resume & uni apps', sub: 'Stand out for applications' },
            { value: 'skills', label: 'Learn & grow', sub: 'Pick up real-world experience' },
            { value: 'community', label: 'Give back', sub: 'Make a genuine difference' },
        ],
    },
    {
        id: 'energy',
        question: 'What kind of vibe are you looking for?',
        hint: 'Pick one that feels most like you',
        multi: false,
        options: [
            { value: 'chill', label: 'Chill & low-key', sub: 'Easy pace, no pressure' },
            { value: 'moderate', label: 'Somewhere in between', sub: 'Steady and manageable' },
            { value: 'fast-paced', label: 'Busy & exciting', sub: 'Lots happening at once' },
        ],
    },
    {
        id: 'social',
        question: 'How do you like to work?',
        hint: 'Pick one that feels most like you',
        multi: false,
        options: [
            { value: 'solo', label: 'On my own', sub: 'Independent, self-directed' },
            { value: 'small', label: 'Small group', sub: 'A few people, close-knit' },
            { value: 'big', label: 'Big group', sub: 'Meet lots of new people' },
        ],
    },
    {
        id: 'task',
        question: 'What kind of tasks sound like you?',
        hint: 'Pick one that feels most like you',
        multi: false,
        options: [
            { value: 'people', label: 'Talking & helping', sub: 'Working directly with people' },
            { value: 'creative', label: 'Creative stuff', sub: 'Art, design, content, media' },
            { value: 'background', label: 'Behind the scenes', sub: 'Organizing, sorting, setting up' },
            { value: 'physical', label: 'Hands-on & active', sub: 'Physical tasks, being outdoors' },
        ],
    },
    {
        id: 'skills',
        question: 'What skills do you want to build?',
        hint: 'Pick all that apply',
        multi: true,
        options: [
            { value: 'communication', label: 'Communication', sub: 'Speaking, listening, presenting' },
            { value: 'leadership', label: 'Leadership', sub: 'Taking initiative, guiding others' },
            { value: 'creative', label: 'Creative', sub: 'Design, art, content, media' },
            { value: 'tech', label: 'Tech & digital', sub: 'Tools, systems, social media' },
            { value: 'teamwork', label: 'Teamwork', sub: 'Collaborating, being reliable' },
            { value: 'empathy', label: 'Working with people', sub: 'Care, patience, listening' },
        ],
    },
    {
        id: 'availability',
        question: 'When are you usually free?',
        hint: 'Pick all that apply',
        multi: true,
        options: [
            { value: 'weekends', label: 'Weekends', sub: 'Saturdays and/or Sundays' },
            { value: 'afterschool', label: 'After school', sub: 'Weekday afternoons' },
            { value: 'breaks', label: 'School breaks', sub: 'Holidays, summer, reading week' },
            { value: 'flexible', label: 'Flexible', sub: "I'll work around it" },
        ],
    },
    {
        id: 'onboarding',
        question: 'How do you feel about training before you start?',
        hint: 'Be honest — orgs want to match your style',
        multi: false,
        options: [
            { value: 'jump-in', label: 'Just throw me in', sub: "I'll figure it out as I go" },
            { value: 'light', label: 'Quick rundown is fine', sub: 'A short briefing works for me' },
            { value: 'structured', label: 'I like proper training', sub: "I'd rather know what I'm doing first" },
            { value: 'depends', label: 'Depends on the role', sub: "I'm flexible either way" },
        ],
    },
]

type Answers = Record<string, string | string[]>

export default function Quiz() {
    const router = useRouter()
    const { user } = useUser()
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Answers>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const q = questions[current]
    const isLast = current === questions.length - 1

    const currentAnswer = answers[q.id]
    const multiSelected: string[] = q.multi ? (currentAnswer as string[]) || [] : []
    const singleSelected: string | null = !q.multi ? (currentAnswer as string) || null : null
    const hasSelection = q.multi ? multiSelected.length > 0 : singleSelected !== null
    const progress = ((current + (hasSelection ? 1 : 0)) / questions.length) * 100

    const handleSelect = (value: string) => {
        if (q.multi) {
            const prev = (answers[q.id] as string[]) || []
            const updated = prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
            setAnswers({ ...answers, [q.id]: updated })
        } else {
            setAnswers({ ...answers, [q.id]: value })
        }
    }

    const isSelected = (value: string): boolean => {
        if (q.multi) return multiSelected.includes(value)
        return singleSelected === value
    }

    const handleNext = async () => {
        if (!hasSelection) return

        if (isLast) {
            if (!user) return
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/quiz`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clerkId: user.id,
                        ...answers,
                    }),
                })

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || 'Something went wrong')
                    return
                }

                router.push('/student/dashboard')

            } catch (err) {
                setError('Could not connect to server')
            } finally {
                setLoading(false)
            }
        } else {
            setCurrent(current + 1)
        }
    }

    const handleBack = () => {
        if (current === 0) {
            router.push('/student/onboarding')
        } else {
            setCurrent(current - 1)
        }
    }

    return (
        <main className={styles.page}>

            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.nav}>
                <button className={styles.backBtn} onClick={handleBack}>← Back</button>
                <span className={styles.stepCount}>{current + 1} / {questions.length}</span>
            </div>

            <div className={styles.card}>
                <h1 className={styles.question}>{q.question}</h1>
                <p className={styles.hint}>
                    {q.multi && <span className={styles.multiTag}>Multi-select · </span>}
                    {q.hint}
                </p>

                <div className={styles.options}>
                    {q.options.map(opt => (
                        <button
                            key={opt.value}
                            className={`${styles.optionBtn} ${isSelected(opt.value) ? styles.selected : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {q.multi && (
                                <span className={`${styles.checkbox} ${isSelected(opt.value) ? styles.checkboxChecked : ''}`}>
                                    {isSelected(opt.value) ? '✓' : ''}
                                </span>
                            )}
                            <span className={styles.optionText}>
                                <span className={styles.optionLabel}>{opt.label}</span>
                                <span className={styles.optionSub}>{opt.sub}</span>
                            </span>
                        </button>
                    ))}
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={`${styles.nextBtn} ${hasSelection && !loading ? styles.active : styles.inactive}`}
                    onClick={handleNext}
                    disabled={!hasSelection || loading}
                >
                    {isLast ? (loading ? 'Saving...' : 'Show my matches 🎯') : 'Next →'}
                </button>

                <div className={styles.dots}>
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i === current ? styles.dotActive : ''} ${answers[questions[i].id] !== undefined ? styles.dotDone : ''}`}
                        />
                    ))}
                </div>
            </div>

        </main>
    )
}