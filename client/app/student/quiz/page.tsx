'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const questions = [
    {
        id: 'energy',
        question: 'What energy feels right for you?',
        options: [
            { value: 'chill', label: 'Chill & relaxed', sub: 'Low-key, no rush' },
            { value: 'moderate', label: 'Somewhere in between', sub: 'Balanced pace' },
            { value: 'fast', label: 'Fast-paced & busy', sub: 'Lots happening at once' },
        ],
    },
    {
        id: 'social',
        question: 'How do you like to work?',
        options: [
            { value: 'solo', label: 'Solo', sub: 'Just me, headphones in' },
            { value: 'small', label: 'Small group', sub: '2–5 people, tight-knit' },
            { value: 'big', label: 'Big group', sub: 'Lots of people, high energy' },
        ],
    },
    {
        id: 'task',
        question: 'What kind of tasks do you enjoy?',
        options: [
            { value: 'people', label: 'People-facing', sub: 'Talking, helping, connecting' },
            { value: 'creative', label: 'Creative work', sub: 'Making, designing, building' },
            { value: 'background', label: 'Behind the scenes', sub: 'Organizing, sorting, supporting' },
        ],
    },
    {
        id: 'motivation',
        question: 'Why do you want to volunteer?',
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
    const progress = ((current) / questions.length) * 100
    const isLast = current === questions.length - 1

    const handleSelect = (value: string) => {
        setSelected(value)
    }

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
        <main style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '3px', backgroundColor: '#f0f0f0' }}>
                <div style={{
                    width: `${progress + (selected ? (1 / questions.length) * 100 : 0)}%`,
                    height: '100%',
                    backgroundColor: '#000',
                    transition: 'width 0.35s ease',
                }} />
            </div>

            <div style={{ width: '100%', maxWidth: '460px', padding: '2rem 1.5rem 4rem' }}>

                {/* Step counter + back */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}
                    >
                        ← Back
                    </button>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                        {current + 1} / {questions.length}
                    </p>
                </div>

                {/* Question */}
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                    {q.question}
                </h1>
                <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
                    Pick one that feels most like you
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
                    {q.options.map(opt => {
                        const isSelected = selected === opt.value
                        return (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    padding: '1rem 1.1rem',
                                    borderRadius: '10px',
                                    border: isSelected ? '2px solid #000' : '2px solid #ebebeb',
                                    backgroundColor: isSelected ? '#000' : '#fafafa',
                                    color: isSelected ? '#fff' : '#222',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s',
                                    width: '100%',
                                }}
                            >
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{opt.label}</span>
                                <span style={{ fontSize: '0.8rem', color: isSelected ? '#ccc' : '#999', marginTop: '0.15rem' }}>{opt.sub}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={!selected}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        backgroundColor: selected ? '#000' : '#e5e5e5',
                        color: selected ? '#fff' : '#aaa',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: selected ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s',
                    }}
                >
                    {isLast ? 'Show my matches 🎯' : 'Next →'}
                </button>
            </div>
        </main>
    )
}