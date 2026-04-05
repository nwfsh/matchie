'use client'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

const OPPORTUNITIES = [
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
    },
    {
        id: '5',
        title: 'Event Setup & Logistics Crew',
        org: 'Multicultural Helping House',
        category: 'Culture & Events',
        location: 'Surrey, BC',
        hours: 'Flexible',
        urgent: false,
        spotsLeft: 12,
        vibe: 'Fast-paced · Big group · Hands-on',
    },
]

const FRIENDS = [
    { name: 'Maya K.', hours: 28, color: '#7c6af7' },
    { name: 'Jordan T.', hours: 21, color: '#3ab87c' },
    { name: 'Priya S.', hours: 35, color: '#e07a3a' },
    { name: 'Lucas M.', hours: 14, color: '#e04a6a' },
    { name: 'Aiko N.', hours: 19, color: '#4ab0e0' },
]

const ME = { name: 'You', hours: 12 }

// Build leaderboard including self
const LEADERBOARD = [...FRIENDS, { name: ME.name, hours: ME.hours, color: '#e07a3a', isSelf: true }]
    .sort((a, b) => b.hours - a.hours)

const HOURS_COMPLETED = 12
const HOURS_GOAL = 30
const PCT = Math.round((HOURS_COMPLETED / HOURS_GOAL) * 100)

export default function Dashboard() {
    const router = useRouter()

    return (
        <main className={styles.page}>

            {/* Top nav */}
            <nav className={styles.topNav}>
                <span className={styles.navLogo}>matchie</span>
                <span className={styles.navGreeting}>Good morning 👋</span>
                <div className={styles.navAvatar}>A</div>
            </nav>

            <div className={styles.body}>

                {/* Stats row */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Hours logged</p>
                        <p className={styles.statValue}>
                            {HOURS_COMPLETED}
                            <span className={styles.statAccent} style={{ fontSize: '1rem' }}>/{HOURS_GOAL}</span>
                        </p>
                        <div className={styles.hoursBarTrack}>
                            <div className={styles.hoursBarFill} style={{ width: `${PCT}%` }} />
                        </div>
                        <p className={styles.statSub}>{HOURS_GOAL - HOURS_COMPLETED} hrs left to graduate 🎓</p>
                    </div>

                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Opportunities saved</p>
                        <p className={styles.statValue}>3</p>
                        <p className={styles.statSub}>2 deadlines this week</p>
                    </div>

                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Friends volunteering</p>
                        <p className={styles.statValue}>{FRIENDS.length}</p>
                        <p className={styles.statSub}>
                            <span className={styles.statAccent}>Priya</span> is leading with {Math.max(...FRIENDS.map(f => f.hours))} hrs
                        </p>
                    </div>
                </div>

                {/* Top matches */}
                <div>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>Top matches for you</span>
                        <button className={styles.sectionLink} onClick={() => router.push('/student/quiz')}>
                            Retake quiz →
                        </button>
                    </div>
                    <div className={styles.oppScroll}>
                        {OPPORTUNITIES.map(opp => (
                            <div
                                key={opp.id}
                                className={styles.oppCard}
                                onClick={() => router.push(`/student/opportunity/${opp.id}`)}
                            >
                                <div className={styles.oppCardTop}>
                                    <span className={styles.oppCategory}>{opp.category}</span>
                                    {opp.urgent && <span className={styles.urgentBadge}>Urgent</span>}
                                </div>
                                <p className={styles.oppTitle}>{opp.title}</p>
                                <p className={styles.oppOrg}>{opp.org}</p>
                                <div className={styles.oppMeta}>
                                    <span className={styles.oppMetaItem}>📍 {opp.location}</span>
                                    <span className={styles.oppMetaItem}>⏱ {opp.hours}</span>
                                    <span className={styles.oppMetaItem}>👤 {opp.spotsLeft} spots left</span>
                                </div>
                                <span className={styles.oppVibe}>✨ {opp.vibe}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friends & leaderboard */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Friends */}
                    <div>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>Friends</span>
                            <button className={styles.sectionLink}>Add friend +</button>
                        </div>
                        <div className={styles.friendsGrid}>
                            {FRIENDS.map(f => (
                                <div key={f.name} className={styles.friendCard}>
                                    <div className={styles.friendAvatar} style={{ background: f.color }}>
                                        {f.name[0]}
                                    </div>
                                    <div className={styles.friendInfo}>
                                        <span className={styles.friendName}>{f.name}</span>
                                        <span className={styles.friendHours}>
                                            <span className={styles.friendHoursAccent}>{f.hours} hrs</span> logged
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>Leaderboard</span>
                        </div>
                        <div className={styles.leaderboard}>
                            {LEADERBOARD.map((entry, i) => {
                                const isSelf = 'isSelf' in entry && entry.isSelf
                                const maxHours = LEADERBOARD[0].hours
                                return (
                                    <div
                                        key={entry.name}
                                        className={`${styles.leaderRow} ${isSelf ? styles.leaderSelf : ''}`}
                                    >
                                        <span className={`${styles.leaderRank} ${i < 3 ? styles.leaderRankTop : ''}`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                        </span>
                                        <span className={styles.leaderName}>{entry.name}</span>
                                        <div className={styles.leaderBar}>
                                            <div
                                                className={styles.leaderBarFill}
                                                style={{ width: `${(entry.hours / maxHours) * 100}%` }}
                                            />
                                        </div>
                                        <span className={styles.leaderHours}>{entry.hours} hrs</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}