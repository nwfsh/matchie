'use client'

import { SignIn } from '@clerk/nextjs'

export default function Home() {
    return (
        <main className="signinPage">

            <div className="blobGreen" />
            <div className="blobOrange" />

            <div className="signinCenter">

                <div className="signinHeading">
                    <div className="signinLogo">🌱</div>
                    <h1 className="signinTitle">Welcome back!</h1>
                    <p className="signinSub">Log in to continue your journey 🌱</p>
                </div>

                <SignIn
                    forceRedirectUrl="/role"
                    appearance={{
                        variables: {
                            colorPrimary: '#F4873E',
                            colorBackground: '#F7F5F2',
                            colorText: '#896B4D',
                            colorTextSecondary: '#A59A92',
                            colorInputBackground: '#FFFFFF',
                            colorInputText: '#634D36',
                            borderRadius: '16px',
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '16px',
                        },
                        elements: {
                            rootBox: {
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            },
                            cardBox: {
                                width: '100%',
                                maxWidth: 'px',
                                boxShadow: 'none',
                                border: 'none',
                            },
                            card: {
                                width: '100%',
                                background: 'transparent',
                                boxShadow: 'none',
                                border: 'none',
                                padding: '35px 0',   // ← adds top/bottom breathing room
                            },
                            headerTitle: { display: 'none' },
                            headerSubtitle: { display: 'none' },
                            header: { display: 'none' },
                            socialButtonsBlockButton: {
                                border: '1px solid #E0B094',
                                borderRadius: '16px',
                                color: '#896B4D',
                                background: '#FFFFFF',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                height: '44px',
                                width: '100%',
                                fontSize: '16px',
                            },
                            socialButtonsBlockButtonText: {
                                color: '#896B4D',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                            },
                            dividerLine: { background: '#E0B094' },
                            dividerText: {
                                color: '#A59A92',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                            },
                            formFieldLabel: {
                                color: '#896B4D',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                fontSize: '16px',
                            },
                            formFieldInput: {
                                border: '1px solid #E0B094',
                                borderRadius: '16px',
                                background: '#FFFFFF',
                                color: '#634D36',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                fontSize: '16px',
                                height: '44px',
                                width: '100%',
                                padding: '0 13px',
                            },
                            formButtonPrimary: {
                                background: '#F4873E',
                                boxShadow: '0px 2px 8px rgba(245, 140, 69, 0.18)',
                                borderRadius: '999px',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                fontSize: '18px',
                                letterSpacing: '1.6px',
                                textTransform: 'uppercase',
                                height: '48px',
                                width: '100%',
                                color: '#FFFFFF',
                            },
                            footerActionText: {
                                color: '#A59A92',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                fontSize: '16px',
                            },
                            footerActionLink: {
                                color: '#F4873E',
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontWeight: '400',
                                fontSize: '16px',
                            },
                            
                        },
                    }}
                />
            </div>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; }

                .signinPage {
                    min-height: 100vh;
                    background: #F7F5F2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                }

                .blobGreen {
                    position: fixed;
                    width: 557px; height: 520px;
                    left: 50%; top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(161, 194, 128, 0.15);
                    filter: blur(100px);
                    border-radius: 9999px;
                    pointer-events: none;
                    z-index: 0;
                }

                .blobOrange {
                    position: fixed;
                    width: 340px; height: 304px;
                    left: 50%; top: 50%;
                    transform: translate(-70%, -40%);
                    background: rgba(244, 135, 62, 0.1);
                    filter: blur(50px);
                    border-radius: 9999px;
                    pointer-events: none;
                    z-index: 0;
                }

                .signinCenter {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 28px;
                    width: 100%;
                    max-width: 384px;
                }

                .signinHeading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    width: 100%;
                    text-align: center;
                }

                .signinLogo {
                    font-size: 52px;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .signinTitle {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-style: normal;
                    font-weight: 400;
                    font-size: 40px;
                    line-height: 45px;
                    color: #4D6F53;
                    text-align: center;
                    margin: 0;
                }

                .signinSub {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-weight: 400;
                    font-size: 18px;
                    line-height: 24px;
                    color: #896B4D;
                    text-align: center;
                    margin: 0;
                }
                    
            `}</style>
        </main>
    )
}