'use client'

import { useState, useRef } from 'react'

interface Opportunity {
  _id: string
  title: string
  causeArea: string
  description: string
  requiredSkills: string[]
  responsibilities: string[]
  commitmentType: string
  location: string
  isRemote: boolean
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function NonprofitUploadPage() {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [status, setStatus] = useState<'idle' | 'recording' | 'done' | 'uploading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [transcript, setTranscript] = useState('')
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)

  // ── Start recording ──────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
        setStatus('done')
        setStatusMessage('Recording complete. Review and submit below.')
      }

      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
      setStatus('recording')
      setStatusMessage('Recording… speak clearly.')
    } catch {
      setStatus('error')
      setStatusMessage('Microphone access was denied. Please allow microphone and try again.')
    }
  }

  // ── Stop recording ───────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
    }
  }

  // ── Submit to server ─────────────────────────────────────────────────────────
  const submitVoice = async () => {
    if (!audioBlob) {
      setStatusMessage('Please record your opportunity first.')
      return
    }

    setStatus('uploading')
    setStatusMessage('Transcribing and processing your recording…')

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const res = await fetch(`${API}/api/opportunities/voice`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setStatusMessage(data.message || 'Something went wrong.')
        return
      }

      setTranscript(data.transcript || '')
      setOpportunity(data.opportunity || null)
      setStatus('success')
      setStatusMessage('Your opportunity has been saved!')
    } catch {
      setStatus('error')
      setStatusMessage('Could not reach the server. Is it running?')
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  const reset = () => {
    setAudioBlob(null)
    setTranscript('')
    setOpportunity(null)
    setStatus('idle')
    setStatusMessage('')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Volunteer Opportunity</h1>
          <p className="text-gray-500">
            Record a short voice description. We'll automatically extract the details and save it.
          </p>
        </div>

        {/* Prompt card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <p className="font-semibold text-gray-700 mb-3">Please include in your recording:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span>🎯</span><span>What is the volunteer role?</span></li>
            <li className="flex gap-2"><span>📋</span><span>What will volunteers do day-to-day?</span></li>
            <li className="flex gap-2"><span>🛠</span><span>What skills or experience are helpful?</span></li>
            <li className="flex gap-2"><span>📅</span><span>Is it weekly, one-time, or flexible?</span></li>
            <li className="flex gap-2"><span>📍</span><span>Where is it located? Is it remote?</span></li>
          </ul>
          <p className="mt-4 text-sm text-gray-400 italic">
            Example: "We need weekly tutors for high school students in Vancouver. Patience and good communication skills are helpful."
          </p>
        </div>

        {/* Recording controls */}
        {status !== 'success' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex gap-3 mb-4">
              {!recording ? (
                <button
                  onClick={startRecording}
                  disabled={status === 'uploading'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-medium rounded-xl transition-colors"
                >
                  🎙 {audioBlob ? 'Re-record' : 'Start Recording'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors animate-pulse"
                >
                  ⏹ Stop Recording
                </button>
              )}

              <button
                onClick={submitVoice}
                disabled={!audioBlob || recording || status === 'uploading'}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium rounded-xl transition-colors"
              >
                {status === 'uploading' ? '⏳ Processing…' : '✅ Submit'}
              </button>
            </div>

            {/* Audio preview */}
            {audioBlob && status !== 'uploading' && (
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mt-2" />
            )}

            {/* Status message */}
            {statusMessage && (
              <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
                {statusMessage}
              </p>
            )}
          </div>
        )}

        {/* Success state */}
        {status === 'success' && opportunity && (
          <div className="space-y-4">
            {/* Transcript */}
            {transcript && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">What we heard</p>
                <p className="text-sm text-yellow-900">{transcript}</p>
              </div>
            )}

            {/* Saved opportunity */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Saved Opportunity</p>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{opportunity.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                {opportunity.causeArea} · {opportunity.location} · {opportunity.commitmentType}
                {opportunity.isRemote && ' · Remote'}
              </p>
              <p className="text-sm text-gray-700 mb-4">{opportunity.description}</p>

              {opportunity.requiredSkills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Skills needed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.requiredSkills.map((s) => (
                      <span key={s} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {opportunity.responsibilities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Responsibilities</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                    {opportunity.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={reset}
              className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              + Post another opportunity
            </button>
          </div>
        )}
      </div>
    </main>
  )
}