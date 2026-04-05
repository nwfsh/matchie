'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'zh-CN', label: '中文 (简)' },
    { code: 'zh-TW', label: '中文 (繁)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'es', label: 'Español' },
    { code: 'tl', label: 'Filipino' },
    { code: 'ko', label: '한국어' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'ja', label: '日本語' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'ur', label: 'اردو' },
]

function LanguagePicker() {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState('en')

    const selectLanguage = (code: string) => {
        setCurrent(code)
        setOpen(false)
    
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        document.cookie = `googtrans=/en/${code}; expires=${date.toUTCString()}; path=/`
        document.cookie = `googtrans=/en/${code}; expires=${date.toUTCString()}; path=/; domain=${window.location.hostname}`
        window.location.reload()
    }

    const currentLabel = LANGUAGES.find(l => l.code === current)?.label || '🌐'

    return (
        <>
            <style>{`
               .lang-picker {
    position: fixed;
    top: 20px;   /* changed */
    right: 20px;
    z-index: 9999;
}
                .lang-btn {
                    display: flex; align-items: center; gap: 6px;
                    background: rgba(245, 239, 230, 0.95);
                    border: 1px solid #c8b898;
                    border-radius: 20px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7a6b52;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(100,80,40,0.12);
                    backdrop-filter: blur(8px);
                    transition: all 0.15s ease;
                }
                .lang-btn:hover { background: rgba(235, 225, 210, 0.98); }
                .lang-dropdown {
                    position: absolute;  top: 42px; right: 0;
                    background: rgba(255, 252, 245, 0.98);
                    border: 1px solid #c8b898;
                    border-radius: 14px;
                    padding: 6px;
                    min-width: 160px;
                    box-shadow: 0 8px 32px rgba(100,80,40,0.15);
                    backdrop-filter: blur(12px);
                    max-height: 300px;
                    overflow-y: auto;
                }
                    

                .lang-option {
                    display: block; width: 100%;
                    padding: 8px 12px;
                    font-size: 12px;
                    color: #5a4f3c;
                    border: none; background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    text-align: left;
                    transition: background 0.1s ease;
                }
                .lang-option:hover { background: #e8f0e4; color: #2d3a1e; }
                .lang-option.active { background: #e8f0e4; color: #4a7c59; font-weight: 600; }
                .goog-te-banner-frame, .skiptranslate { display: none !important; }
                body { top: 0 !important; }
            `}</style>

            <div className="lang-picker">
                {open && (
                    <div className="lang-dropdown">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                className={`lang-option ${current === lang.code ? 'active' : ''}`}
                                onClick={() => selectLanguage(lang.code)}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
                <button className="lang-btn" onClick={() => setOpen(!open)}>
                    🌐 {currentLabel}
                </button>
            </div>

            {/* Hidden Google Translate element — no visible UI, just powers the translation */}
            <div id="google_translate_element" style={{ display: 'none' }} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        function googleTranslateElementInit() {
                            new google.translate.TranslateElement({
                                pageLanguage: 'en',
                                autoDisplay: false
                            }, 'google_translate_element');
                        }
                    `
                }}
            />
            <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
        </>
    )
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            >
                <body className="min-h-full flex flex-col">
                    {children}
                    <LanguagePicker />
                </body>
            </html>
        </ClerkProvider>
    );
}