'use client'

import styles from './dashboard.module.css'
import { useDashboard } from './useDashboard'
import type { Certificate } from './useDashboard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Opportunity {
    _id: string
    title: string
    causeArea: string
    description: string
    requiredSkills: string[]
    commitmentType: string
    location: string
    isRemote: boolean
}
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


interface Match {
    opportunity: Opportunity
    matchPercentage: number
    reason: string
}

interface ActivityItem {
    color: string
    title: string
    org: string
    date: string
    hours: string
}

// ── Static data ───────────────────────────────────────────────────────────────

const ACTIVITY: ActivityItem[] = [
    { color: '#A1C280', title: 'Community Garden Helper', org: 'Green Thumbs Youth', date: 'Mar 28', hours: '3h' },
    { color: '#F4873E', title: 'Food Bank Sorting', org: 'City Food Pantry', date: 'Mar 20', hours: '4h' },
    { color: '#7091A9', title: 'Reading Buddy Program', org: 'Little Readers Club', date: 'Mar 14', hours: '2h' },
]

const LOCKED_CERTS = [
    { title: 'Community Champion', earned: false },
    { title: 'Super Volunteer', earned: false },
    { title: 'Impact Leader', earned: false },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconFlame() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2s3 2.5 3 5.5a3 3 0 0 1-6 0C5 5.5 6 4 6 4s-.5 2 1 3c.5-1.5 1-5 1-5z" stroke="#F4873E" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    )
}

function IconCalendar() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="#F4873E" strokeWidth="1.5" />
            <path d="M6.5 1.5v4M13.5 1.5v4M2.5 8.5h15" stroke="#F4873E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function IconAward({ color = '#D99D26' }: { color?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="8" r="5" stroke={color} strokeWidth="1.5" />
            <path d="M6.5 12.5l-1 6 4.5-2 4.5 2-1-6" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    )
}

function IconClock({ color = '#A59A92' }: { color?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.5" />
            <path d="M10 6v4l2.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function IconTrophy({ color = '#F4873E' }: { color?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 3h8v6a4 4 0 0 1-8 0V3z" stroke={color} strokeWidth="1.5" />
            <path d="M3 4h3v4a1.5 1.5 0 0 1-3 0V4zM17 4h-3v4a1.5 1.5 0 0 0 3 0V4z" stroke={color} strokeWidth="1.5" />
            <path d="M10 13v3M7 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function IconArrowRight() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function IconSearch() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#F4873E" strokeWidth="2" />
            <path d="M16 16l4 4" stroke="#F4873E" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function IconMapPin() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="#A59A92" strokeWidth="1" />
            <circle cx="6" cy="4.5" r="1" stroke="#A59A92" strokeWidth="1" />
        </svg>
    )
}

function IconCalSmall() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#A59A92" strokeWidth="1" />
            <path d="M4 1v2M8 1v2M1 5h10" stroke="#A59A92" strokeWidth="1" strokeLinecap="round" />
        </svg>
    )
}

function IconPeople() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="4.5" cy="3.5" r="2" stroke="#A59A92" strokeWidth="1" />
            <path d="M1 10.5c0-2 1.6-3.5 3.5-3.5" stroke="#A59A92" strokeWidth="1" strokeLinecap="round" />
            <circle cx="8.5" cy="3.5" r="2" stroke="#A59A92" strokeWidth="1" />
            <path d="M11 10.5c0-2-1.6-3.5-3.5-3.5" stroke="#A59A92" strokeWidth="1" strokeLinecap="round" />
        </svg>
    )
}

function IconCheck() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#A1C280" strokeWidth="1" />
            <path d="M3.5 6l2 2 3-3" stroke="#A1C280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function IconLockSmall() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="5.5" width="8" height="5.5" rx="1" stroke="#A59A92" strokeWidth="1" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="#A59A92" strokeWidth="1" strokeLinecap="round" />
        </svg>
    )
}

function IconLock() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="#A59A92" strokeWidth="1.3" />
            <path d="M5 7.5V5a3 3 0 0 1 6 0v2.5" stroke="#A59A92" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { firstName, hoursCompleted, hoursGoal, pct, certificates, loading: loadingDash } = useDashboard()
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isLoaded || !user) return
        const fetchMatches = async () => {
            try {
                const res = await fetch(`${API}/api/matching/${user.id}`)
                const data = await res.json()
                if (!res.ok) { setError(data.error || 'Failed to load matches'); return }
                setMatches(data.matches || [])
            } catch {
                setError('Could not connect to server.')
            } finally {
                setLoading(false)
            }
        }
        fetchMatches()
    }, [isLoaded, user])




    const allCerts = [
        { title: 'Beginner Volunteer', earned: true },
        { title: '10 Hours Logged', earned: hoursCompleted >= 10 },
        ...certificates.map((c: Certificate) => ({ title: c.title, earned: true })),
        ...LOCKED_CERTS,
    ].slice(0, 6)

    return (
        <div className={styles.page}>
            <div className={styles.blobTopRight} />
            <div className={styles.blobBottomRight} />
            <div className={styles.blobCenter} />

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <div className={styles.logoMark}>🌱</div>
                    <span className={styles.logoText}>Let's Soil</span>
                </div>
                <div className={styles.notifBadge}>
                    <IconFlame />
                    <span>7</span>
                </div>
            </header>

            <main className={styles.main}>

                {/* Greeting */}
                <div className={styles.greeting}>
                    <h1 className={styles.greetingName}>
                        Hey{firstName ? `, ${firstName}` : ''}!
                    </h1>
                    <p className={styles.greetingSub}>Keep growing — you're doing amazing.</p>
                </div>

                {/* Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}><IconCalendar /></div>
                        <div className={styles.statBody}>
                            <div className={styles.statValue}>8</div>
                            <div className={styles.statLabel}>Events Attended</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}><IconAward /></div>
                        <div className={styles.statBody}>
                            <div className={styles.statValue}>{loadingDash ? '—' : certificates.length || 2}</div>
                            <div className={styles.statLabel}>Certifications</div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardWide}`}>
                        <div className={styles.statIcon}><IconClock color="#A59A92" /></div>
                        <div className={styles.statBody}>
                            <div className={styles.statValue}>{loadingDash ? '—' : hoursCompleted || 24}</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${loadingDash ? 0 : pct}%` }} />
                            </div>
                            <div className={styles.statLabel}>Hours Logged</div>
                        </div>
                    </div>
                </div>

                {/* Top 5 Matches */}
                <div className={styles.matchesCard}>
                    <div className={styles.matchesHeader}>
                        <IconTrophy />
                        <span className={styles.matchesTitle}>Your Top 5 Matches</span>
                    </div>
                    <div className={styles.matchesList}>
                        <div className={styles.matchesInner}>
                            {loading && <p style={{ color: '#A59A92', fontSize: '0.85rem' }}>Finding your matches…</p>}
                            {error && <p style={{ color: '#cc0000', fontSize: '0.85rem' }}>{error}</p>}
                            {!loading && !error && matches.map(({ opportunity: opp, matchPercentage }, index) => (
                                <div key={opp._id} className={styles.oppCard}>
                                    <div className={styles.oppLogo}>
                                        #{index + 1}
                                    </div>
                                    <div className={styles.oppContent}>
                                        <div className={styles.oppMeta}>
                                            <span className={styles.oppRankLabel}>#{index + 1} Match · {matchPercentage}%</span>
                                            <span className={styles.oppCategory}>{opp.causeArea}</span>
                                        </div>
                                        <h3 className={styles.oppTitle}>{opp.title}</h3>
                                        <p className={styles.oppDesc}>{opp.description}</p>
                                        <div className={styles.oppDetails}>
                                            <span className={styles.oppDetail}><IconMapPin />{opp.location}</span>
                                            <span className={styles.oppDetail}>{opp.commitmentType}</span>
                                            {opp.isRemote && <span className={styles.oppDetail}>Remote</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <a href="/opportunities" className={styles.browseBtn}>
                                <span>Browse all opportunities</span>
                                <IconArrowRight />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Certifications */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <IconAward color="#F4873E" />
                        Certifications
                    </h2>
                    <div className={styles.certsRow}>
                        {allCerts.map((c, i) => (
                            <div key={i} className={`${styles.certCard} ${!c.earned ? styles.certLocked : ''}`}>
                                <div className={`${styles.certIconWrap} ${!c.earned ? styles.certIconLocked : ''}`}>
                                    {!c.earned ? <IconLock /> : <IconAward color="#D99D26" />}
                                </div>
                                <p className={styles.certTitle}>{c.title}</p>
                                <div className={styles.certStatus}>
                                    {!c.earned
                                        ? <><IconLockSmall /><span>Locked</span></>
                                        : <><IconCheck /><span>Earned</span></>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <IconCalendar />
                        Recent Activity
                    </h2>
                    <div className={styles.activityList}>
                        {ACTIVITY.map((item, i) => (
                            <div key={i} className={styles.activityRow}>
                                <div className={styles.activityIcon}>
                                    <IconTrophy color={item.color} />
                                </div>
                                <div className={styles.activityInfo}>
                                    <p className={styles.activityTitle}>{item.title}</p>
                                    <p className={styles.activityMeta}>{item.org} · {item.date}</p>
                                </div>
                                <div className={styles.activityHours}>{item.hours}</div>
                            </div>
                        ))}
                    </div>
                </section>



            </main>
        </div>
    )
}