'use client'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import styles from './role.module.css'

export default function RolePage() {
    const router = useRouter()
    const { signOut } = useClerk()

    return (
        <main className={styles.page}>
            <div className={styles.blobGreen} />
            <div className={styles.blobOrange} />
            <div className={styles.center}>

                <div className={styles.heading}>
                    <img src="icon.png" alt="logo" width={300} height={300} />
                    <h1 className={styles.title}>Welcome to Matchie!</h1>
                    <p className={styles.subtitle}>Are you a student or a non-profit organisation?</p>
                </div>

                <div className={styles.buttons}>
                    <button
                        className={styles.btnStudent}
                        onClick={() => router.push('/student/onboarding')}
                    >
                        <span>Student</span>
                        <span>›</span>
                    </button>

                    <button
                        className={styles.btnNgo}
                        onClick={() => router.push('/nonprofit/upload')}
                    >
                        <span>NGO</span>
                        <span>›</span>
                    </button>

                    <button
                        className={styles.btnSignOut}
                        onClick={() => signOut(() => router.push('/'))}
                    >
                        Sign out
                    </button>
                </div>

            </div>
        </main>
    )
}