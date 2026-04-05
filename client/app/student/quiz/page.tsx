'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './quiz.module.css'

const questions = [
    {
        id: 'energy',
        question: 'What energy feels right for you?',
        hint: 'Pick one that feels most like you',
        options: [
            { value: 'chill', label: 'Chill & relaxed', sub: 'Low-key, no rush' },
            { value: 'moderate', label: 'Somewhere in between', sub: 'Balanced pace' },
            { value: 'fast', label: 'Fast-paced & busy', sub: 'Lots happening at once' },
        ],
    },
    {
        id: 'social',
        question: 'How do you like to work?',
        hint: 'Pick one that feels most like you',
        options: [
            { value: 'solo', label: 'Solo', sub: 'Just me, headphones in' },
            { value: 'small', label: 'Small group', sub: '2–5 people, tight-knit' },
            { value: 'big', label: 'Big group', sub: 'Lots of people, high energy' },
        ],
    },
    {
        id: 'task',
        question: 'What kind of tasks do you enjoy?',
        hint: 'Pick one that feels most like you',
        options: [
            { value: 'people', label: 'People-facing', sub: 'Talking, helping, connecting' },
            { value: 'creative', label: 'Creative work', sub: 'Making, designing, building' },
            { value: 'background', label: 'Behind the scenes', sub: 'Organizing, sorting, supporting' },
        ],
    },
    {
        id: 'motivation',
        question: 'Why do you want to volunteer?',
        hint: 'Pick one that feels most like you',
        options: [
            { value: 'community', label: 'Give back', sub: 'Genuinely make a difference' },
            { value: 'network', label: 'Meet people', sub: 'Connections and references' },
            { value: 'skills', label: 'Learn something new', sub: 'Pick up skills along the way' },
            { value: 'casual', label: 'Grad hours + perks', sub: 'Hours + maybe free food' },
        ],
    },
    {
        id: 'skills',
        question: 'What do you want to walk away with?',
        hint: 'Pick one that feels most like you',
        options: [
            { value: 'language', label: 'A new language', sub: 'Practice speaking with others' },
            { value: 'leadership', label: 'Leadership', sub: 'Take initiative, lead a team' },
            { value: 'creative', label: 'Creative skills', sub: 'Art, design, content creation' },
            { value: 'tech', label: 'Tech skills', sub: 'Computers, tools, systems' },
            { value: 'people', label: 'People skills', sub: 'Communication, empathy' },
        ],
    },
]

export default function Quiz() {
    const router = useRouter()
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [selected, setSelected] = useState<string | null>(null)

    const q = questions[current]
    const isLast = current === questions.length - 1
    const progress = ((current + (selected ? 1 : 0)) / questions.length) * 100

    const handleSelect = (value: string) => setSelected(value)

    const handleNext = () => {
        if (!selected) return
        const newAnswers = { ...answers, [q.id]: selected }
        setAnswers(newAnswers)
        if (isLast) {
            localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
            router.push('/student/dashboard')
        } else {
            setCurrent(current + 1)
            setSelected(answers[questions[current + 1]?.id] || null)
        }
    }

    const handleBack = () => {
        if (current === 0) {
            router.push('/student/onboarding')
        } else {
            setCurrent(current - 1)
            setSelected(answers[questions[current - 1].id] || null)
        }
    }

    return (
        <main className={styles.page}>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            {/* Nav row */}
            <div className={styles.nav}>
                <button className={styles.backBtn} onClick={handleBack}>← Back</button>
                <span className={styles.stepCount}>{current + 1} / {questions.length}</span>
            </div>

            <div className={styles.card}>
                <h1 className={styles.question}>{q.question}</h1>
                <p className={styles.hint}>{q.hint}</p>

                {/* Options */}
                <div className={styles.options}>
                    {q.options.map(opt => (
                        <button
                            key={opt.value}
                            className={`${styles.optionBtn} ${selected === opt.value ? styles.selected : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            <span className={styles.optionLabel}>{opt.label}</span>
                            <span className={styles.optionSub}>{opt.sub}</span>
                        </button>
                    ))}
                </div>

                {/* Next button */}
                <button
                    className={`${styles.nextBtn} ${selected ? styles.active : styles.inactive}`}
                    onClick={handleNext}
                    disabled={!selected}
                >
                    {isLast ? 'Show my matches 🎯' : 'Next →'}
                </button>

                {/* Dot indicators */}
                <div className={styles.dots}>
                    {questions.map((_, i) => (
                        <div key={i} className={`${styles.dot} ${i === current ? styles.active : ''}`} />
                    ))}
                </div>
            </div>

        </main>
    )
}