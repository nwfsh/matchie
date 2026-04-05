'use client'
import { SignIn } from '@clerk/nextjs'

export default function Home() {
    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#fafafa'
        }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Matchie 🤝
            </h1>
            <p style={{ color: 'gray', marginBottom: '2rem' }}>
                Volunteer matching for BC students
            </p>
            <SignIn forceRedirectUrl="/role" />
        </main>
    )
}