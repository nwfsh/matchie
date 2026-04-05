'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

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

// ─── Opportunity Data ──────────────────────────────────────────────────────────

type Opportunity = {
    id: string
    title: string
    org: string
    category: string
    location: string
    hours: string
    urgent: boolean
    spotsLeft: number
    vibe: string
    description: string
    // Matching metadata
    causeAreas: string[]
    skillsNeeded: string[]
    availabilityType: string[]
    energyLevel: 'low' | 'medium' | 'high'
    taskType: 'hands-on' | 'creative' | 'social' | 'technical'
    socialLevel: 'solo' | 'small-group' | 'large-group'
    isRemote: boolean
}

const OPPORTUNITIES: Opportunity[] = [
    {
        id: '1',
        title: 'Food Bank Sorting Crew',
        org: 'Vancouver Food Bank',
        category: 'Community',
        location: 'Vancouver, BC',
        hours: '3 hrs/week',
        urgent: true,
        spotsLeft: 3,
        vibe: 'Chill · Small group · Behind the scenes',
        description: 'Sort and pack food donations for families in need. No experience needed.',
        causeAreas: ['food-security', 'community', 'poverty'],
        skillsNeeded: ['physical', 'organizing'],
        availabilityType: ['weekdays', 'weekends'],
        energyLevel: 'low',
        taskType: 'hands-on',
        socialLevel: 'small-group',
        isRemote: false,
    },
    {
        id: '2',
        title: 'Youth Soccer Coach Helper',
        org: 'Richmond Youth Sports',
        category: 'Sports & Rec',
        location: 'Richmond, BC',
        hours: '4 hrs/weekend',
        urgent: false,
        spotsLeft: 8,
        vibe: 'High energy · Big group · People-facing',
        description: 'Assist coaches during weekend soccer sessions for kids aged 6–12.',
        causeAreas: ['youth', 'sports', 'education'],
        skillsNeeded: ['sports', 'communication', 'leadership'],
        availabilityType: ['weekends'],
        energyLevel: 'high',
        taskType: 'social',
        socialLevel: 'large-group',
        isRemote: false,
    },
    {
        id: '3',
        title: 'Social Media & Design Volunteer',
        org: 'BC Wildlife Federation',
        category: 'Environment',
        location: 'Remote',
        hours: '2–4 hrs/week',
        urgent: false,
        spotsLeft: 2,
        vibe: 'Creative · Solo · Flexible',
        description: 'Create graphics and posts for environmental campaigns. Work from home.',
        causeAreas: ['environment', 'wildlife', 'conservation'],
        skillsNeeded: ['design', 'social-media', 'writing'],
        availabilityType: ['flexible'],
        energyLevel: 'low',
        taskType: 'creative',
        socialLevel: 'solo',
        isRemote: true,
    },
    {
        id: '4',
        title: 'Senior Companion Visitor',
        org: 'Burnaby Seniors Centre',
        category: 'Health & Wellness',
        location: 'Burnaby, BC',
        hours: '2 hrs/week',
        urgent: true,
        spotsLeft: 5,
        vibe: 'Chill · One-on-one · People-facing',
        description: "Visit seniors who don't get many visitors. Low-pressure and meaningful.",
        causeAreas: ['elderly', 'health', 'community'],
        skillsNeeded: ['communication', 'empathy', 'listening'],
        availabilityType: ['weekdays', 'weekends', 'flexible'],
        energyLevel: 'low',
        taskType: 'social',
        socialLevel: 'small-group',
        isRemote: false,
    },
    {
        id: '5',
        title: 'Event Setup & Logistics Crew',
        org: 'Multicultural Helping House',
        category: 'Culture & Events',
        location: 'Surrey, BC',
        hours: 'Flexible, event-based',
        urgent: false,
        spotsLeft: 12,
        vibe: 'Fast-paced · Big group · Hands-on',
        description: 'Help set up community cultural events. Rack up hours fast and meet new people.',
        causeAreas: ['culture', 'community', 'diversity'],
        skillsNeeded: ['physical', 'organizing', 'teamwork'],
        availabilityType: ['weekends', 'flexible'],
        energyLevel: 'high',
        taskType: 'hands-on',
        socialLevel: 'large-group',
        isRemote: false,
    },
]

// ─── Matching Engine ───────────────────────────────────────────────────────────

type ScoredOpportunity = Opportunity & { matchScore: number; matchReasons: string[] }

function scoreOpportunity(opp: Opportunity, quiz: Quiz | null): { score: number; reasons: string[] } {
    if (!quiz) return { score: 0, reasons: [] }

    let score = 0
    const reasons: string[] = []

    // Cause area match (0–30 pts)
    if (quiz.cause && quiz.cause.length > 0) {
        const causeMatches = opp.causeAreas.filter(c =>
            quiz.cause!.some(qc => c.toLowerCase().includes(qc.toLowerCase()) || qc.toLowerCase().includes(c.toLowerCase()))
        )
        if (causeMatches.length > 0) {
            score += Math.min(causeMatches.length * 15, 30)
            reasons.push('Matches your cause interests')
        }
    }

    // Skills match (0–20 pts)
    if (quiz.skills && quiz.skills.length > 0) {
        const skillMatches = opp.skillsNeeded.filter(s =>
            quiz.skills!.some(qs => s.toLowerCase().includes(qs.toLowerCase()) || qs.toLowerCase().includes(s.toLowerCase()))
        )
        if (skillMatches.length > 0) {
            score += Math.min(skillMatches.length * 10, 20)
            reasons.push('Uses your skills')
        }
    }

    // Availability match (0–15 pts)
    if (quiz.availability && quiz.availability.length > 0) {
        const availMatches = opp.availabilityType.filter(a =>
            quiz.availability!.some(qa => a.toLowerCase().includes(qa.toLowerCase()) || qa.toLowerCase().includes(a.toLowerCase()))
        )
        if (availMatches.length > 0) {
            score += 15
            reasons.push('Fits your schedule')
        }
    }

    // Energy level match (0–15 pts)
    if (quiz.energy) {
        const energyMap: Record<string, 'low' | 'medium' | 'high'> = {
            chill: 'low',
            moderate: 'medium',
            'high-energy': 'high',
            low: 'low',
            medium: 'medium',
            high: 'high',
        }
        const preferredEnergy = energyMap[quiz.energy.toLowerCase()]
        if (preferredEnergy && opp.energyLevel === preferredEnergy) {
            score += 15
            reasons.push('Matches your energy vibe')
        }
    }

    // Task type match (0–10 pts)
    if (quiz.task) {
        const taskMap: Record<string, string> = {
            'hands-on': 'hands-on',
            creative: 'creative',
            people: 'social',
            technical: 'technical',
        }
        const preferredTask = taskMap[quiz.task.toLowerCase()] ?? quiz.task.toLowerCase()
        if (opp.taskType === preferredTask || opp.taskType.includes(preferredTask)) {
            score += 10
            reasons.push('Aligns with how you like to work')
        }
    }

    // Social preference match (0–10 pts)
    if (quiz.social) {
        const socialMap: Record<string, string> = {
            solo: 'solo',
            'small group': 'small-group',
            'large group': 'large-group',
            'one-on-one': 'small-group',
        }
        const preferredSocial = socialMap[quiz.social.toLowerCase()] ?? quiz.social.toLowerCase()
        if (opp.socialLevel === preferredSocial || opp.socialLevel.replace('-', ' ').includes(preferredSocial)) {
            score += 10
            reasons.push('Right group size for you')
        }
    }

    // Urgent bonus — slight bump for urgency if goal is to complete hours
    if (opp.urgent && quiz.goal?.toLowerCase().includes('hour')) {
        score += 5
        reasons.push('Urgent — log hours fast')
    }

    return { score, reasons }
}

function rankOpportunities(opportunities: Opportunity[], quiz: Quiz | null): ScoredOpportunity[] {
    return opportunities
        .map(opp => {
            const { score, reasons } = scoreOpportunity(opp, quiz)
            return { ...opp, matchScore: score, matchReasons: reasons }
        })
        .sort((a, b) => b.matchScore - a.matchScore)
}

// ─── Match Badge ───────────────────────────────────────────────────────────────

function MatchBadge({ score }: { score: number }) {
    const pct = Math.min(Math.round((score / 85) * 100), 99) // 85 = rough max score
    const color =
        pct >= 70 ? '#16a34a' :
            pct >= 40 ? '#d97706' :
                '#9ca3af'
    const label =
        pct >= 70 ? 'Great match' :
            pct >= 40 ? 'Good match' :
                'Possible match'

    return (
        <span style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            backgroundColor: `${color}18`,
            color,
            padding: '0.2rem 0.55rem',
            borderRadius: '999px',
            border: `1px solid ${color}40`,
            whiteSpace: 'nowrap',
        }}>
            {label} · {pct}%
        </span>
    )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const router = useRouter()
    const { profile, quiz, loading, hoursCompleted, hoursGoal, pct, firstName } = useDashboard()

    const [activeFilter, setActiveFilter] = useState<'All' | 'Urgent' | 'Remote'>('All')

    const rankedOpportunities = useMemo(
        () => rankOpportunities(OPPORTUNITIES, quiz),
        [quiz]
    )

    const filteredOpportunities = useMemo(() => {
        switch (activeFilter) {
            case 'Urgent': return rankedOpportunities.filter(o => o.urgent)
            case 'Remote': return rankedOpportunities.filter(o => o.isRemote)
            default: return rankedOpportunities
        }
    }, [rankedOpportunities, activeFilter])

    if (loading) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#aaa' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                    <p style={{ fontSize: '0.9rem' }}>Loading your matches…</p>
                </div>
            </main>
        )
    }

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Progress bar — step 3 of 4 */}
            <div style={{ width: '100%', height: '3px', backgroundColor: '#e5e5e5' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#000' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '480px', padding: '2rem 1.5rem 4rem' }}>

                {/* Header */}
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                    {firstName ? `${firstName}'s matches 🎯` : 'Your matches 🎯'}
                </h1>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {quiz ? 'Ranked based on your vibe answers.' : 'Picked for you.'}
                </p>

                {/* Hours tracker */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '1.2rem 1.3rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #eee',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Volunteer hours</span>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>{hoursCompleted} / {hoursGoal} hrs</span>
                    </div>
                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            backgroundColor: '#000',
                            borderRadius: '999px',
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#aaa', margin: '0.5rem 0 0' }}>
                        {hoursGoal - hoursCompleted > 0
                            ? `${hoursGoal - hoursCompleted} more hours to graduate 🎓`
                            : 'Goal reached! 🎉'}
                    </p>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    {(['All', 'Urgent', 'Remote'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '999px',
                                border: activeFilter === tab ? '2px solid #000' : '1.5px solid #ddd',
                                backgroundColor: activeFilter === tab ? '#000' : '#fff',
                                color: activeFilter === tab ? '#fff' : '#666',
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Match context — only when quiz data is present */}
                {quiz && (
                    <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1.2rem',
                        fontSize: '0.8rem',
                        color: '#15803d',
                        lineHeight: 1.5,
                    }}>
                        ✨ Results ranked by how well they match your preferences
                        {quiz.cause && quiz.cause.length > 0 && ` · ${quiz.cause.slice(0, 2).join(', ')}`}
                        {quiz.energy && ` · ${quiz.energy} energy`}
                    </div>
                )}

                {/* Cards */}
                {filteredOpportunities.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#aaa', padding: '3rem 0' }}>
                        <p style={{ fontSize: '1.5rem' }}>🔍</p>
                        <p style={{ fontSize: '0.9rem' }}>No opportunities match this filter right now.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        {filteredOpportunities.map((opp, index) => (
                            <div
                                key={opp.id}
                                onClick={() => router.push(`/student/opportunity/${opp.id}`)}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '1.2rem 1.3rem',
                                    border: index === 0 && quiz ? '2px solid #000' : '1px solid #eee',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'box-shadow 0.15s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                            >
                                {/* Top match label */}
                                {index === 0 && quiz && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-1px',
                                        right: '16px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontSize: '0.65rem',
                                        fontWeight: '700',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '0 0 6px 6px',
                                        letterSpacing: '0.05em',
                                    }}>
                                        TOP PICK
                                    </div>
                                )}

                                {/* Top row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                            {opp.urgent && (
                                                <span style={{
                                                    fontSize: '0.68rem', fontWeight: '700',
                                                    backgroundColor: '#fef3c7', color: '#92400e',
                                                    padding: '0.15rem 0.5rem', borderRadius: '999px',
                                                }}>
                                                    Urgent
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: '600' }}>{opp.category}</span>
                                            {quiz && opp.matchScore > 0 && <MatchBadge score={opp.matchScore} />}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.1rem' }}>{opp.title}</h3>
                                        <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>{opp.org}</p>
                                    </div>
                                    <span style={{ color: '#ccc', fontSize: '1rem', marginLeft: '0.5rem' }}>→</span>
                                </div>

                                {/* Description */}
                                <p style={{ fontSize: '0.83rem', color: '#555', margin: '0.7rem 0 0.6rem', lineHeight: 1.5 }}>
                                    {opp.description}
                                </p>

                                {/* Match reasons */}
                                {quiz && opp.matchReasons.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                                        {opp.matchReasons.slice(0, 2).map((reason, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.71rem',
                                                color: '#6b7280',
                                                backgroundColor: '#f9fafb',
                                                border: '1px solid #e5e7eb',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                            }}>
                                                ✓ {reason}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Meta */}
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                                    <span style={{ fontSize: '0.76rem', color: '#888' }}>📍 {opp.location}</span>
                                    <span style={{ fontSize: '0.76rem', color: '#888' }}>⏱ {opp.hours}</span>
                                    <span style={{ fontSize: '0.76rem', color: '#888' }}>👤 {opp.spotsLeft} spots</span>
                                </div>

                                {/* Vibe tag */}
                                <span style={{
                                    fontSize: '0.75rem', color: '#666',
                                    backgroundColor: '#f5f5f5',
                                    padding: '0.3rem 0.7rem',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                }}>
                                    ✨ {opp.vibe}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}