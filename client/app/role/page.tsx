'use client'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

export default function RolePage() {
    const router = useRouter()
    const { signOut } = useClerk()

    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Matchie 🤝
            </h1>
            <p style={{ color: 'gray', marginBottom: '3rem' }}>Who are you?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                <button
                    onClick={() => router.push('/student/onboarding')}
                    style={{ padding: '1.2rem', fontSize: '1.1rem', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    🎒 I'm a Student
                </button>
                <button
                    onClick={() => router.push('/nonprofit/upload')}
                    style={{ padding: '1.2rem', fontSize: '1.1rem', backgroundColor: 'white', color: 'black', border: '2px solid black', borderRadius: '8px', cursor: 'pointer' }}
                >
                    🏢 I'm a Nonprofit
                </button>
                <button
                    onClick={() => signOut(() => router.push('/'))}
                    style={{ padding: '0.8rem', fontSize: '0.9rem', backgroundColor: 'transparent', color: 'gray', border: 'none', cursor: 'pointer', marginTop: '1rem' }}
                >
                    Sign out
                </button>
            </div>
        </main>
    )
}