'use client'
import { useRouter } from 'next/navigation'

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
        description: 'Sort and pack food donations for families in need. No experience needed.',
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
        description: 'Visit seniors who don\'t get many visitors. Low-pressure and meaningful.',
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
    },
]

export default function Dashboard() {
    const router = useRouter()
    const hoursCompleted = 12
    const hoursGoal = 30
    const pct = Math.round((hoursCompleted / hoursGoal) * 100)

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Progress bar — step 3 of 4 */}
            <div style={{ width: '100%', height: '3px', backgroundColor: '#e5e5e5' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#000' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '480px', padding: '2rem 1.5rem 4rem' }}>

                {/* Header */}
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem' }}>Your matches 🎯</h1>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Picked based on your vibe answers.</p>

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
                        }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.5rem', margin: '0.5rem 0 0' }}>
                        {hoursGoal - hoursCompleted} more hours to graduate 🎓
                    </p>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    {['All', 'Urgent', 'Remote'].map((tab, i) => (
                        <button key={tab} style={{
                            padding: '0.45rem 1rem',
                            borderRadius: '999px',
                            border: i === 0 ? '2px solid #000' : '1.5px solid #ddd',
                            backgroundColor: i === 0 ? '#000' : '#fff',
                            color: i === 0 ? '#fff' : '#666',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {OPPORTUNITIES.map(opp => (
                        <div
                            key={opp.id}
                            onClick={() => router.push(`/student/opportunity/${opp.id}`)}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '1.2rem 1.3rem',
                                border: '1px solid #eee',
                                cursor: 'pointer',
                            }}
                        >
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
            </div>
        </main>
    )
}