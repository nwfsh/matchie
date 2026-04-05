// 'use client'

// import { useState, useRef } from 'react'
// import { useRouter } from 'next/navigation'

// interface Opportunity {
//   _id: string
//   title: string
//   causeArea: string
//   description: string
//   requiredSkills: string[]
//   responsibilities: string[]
//   commitmentType: string
//   location: string
//   isRemote: boolean
// }

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// export default function NonprofitUploadPage() {
//   const [recording, setRecording] = useState(false)
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
//   const [status, setStatus] = useState<'idle' | 'recording' | 'done' | 'uploading' | 'success' | 'error'>('idle')
//   const [statusMessage, setStatusMessage] = useState('')
//   const [transcript, setTranscript] = useState('')
//   const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
//   const recorderRef = useRef<MediaRecorder | null>(null)

//   const router = useRouter()

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const recorder = new MediaRecorder(stream)
//       const chunks: Blob[] = []
//       recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/webm' })
//         setAudioBlob(blob)
//         stream.getTracks().forEach((t) => t.stop())
//         setStatus('done')
//         setStatusMessage('Recording complete. Review and submit below.')
//       }
//       recorder.start()
//       recorderRef.current = recorder
//       setRecording(true)
//       setStatus('recording')
//       setStatusMessage('Recording… speak clearly.')
//     } catch {
//       setStatus('error')
//       setStatusMessage('Microphone access was denied. Please allow microphone and try again.')
//     }
//   }

//   const stopRecording = () => {
//     if (recorderRef.current && recorderRef.current.state === 'recording') {
//       recorderRef.current.stop()
//       setRecording(false)
//     }
//   }

//   const submitVoice = async () => {
//     if (!audioBlob) { setStatusMessage('Please record your opportunity first.'); return }
//     setStatus('uploading')
//     setStatusMessage('Transcribing and processing your recording…')
//     try {
//       const formData = new FormData()
//       formData.append('audio', audioBlob, 'recording.webm')
//       const res = await fetch(`${API}/api/opportunities/voice`, { method: 'POST', body: formData })
//       const data = await res.json()
//       if (!res.ok) { setStatus('error'); setStatusMessage(data.message || 'Something went wrong.'); return }
//       setTranscript(data.transcript || '')
//       setOpportunity(data.opportunity || null)
//       setStatus('success')
//       setStatusMessage('Your opportunity has been saved!')
//     } catch {
//       setStatus('error')
//       setStatusMessage('Could not reach the server. Is it running?')
//     }
//   }

//   const reset = () => {
//     setAudioBlob(null)
//     setTranscript('')
//     setOpportunity(null)
//     setStatus('idle')
//     setStatusMessage('')
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

//         .upload-page {
//           min-height: 100vh;
//           background: #f5efe6;
//           font-family: 'DM Sans', sans-serif;
//           position: relative;
//           overflow: hidden;
//         }

//         /* Decorative blobs */
//         .blob {
//           position: fixed;
//           border-radius: 50%;
//           filter: blur(80px);
//           opacity: 0.35;
//           pointer-events: none;
//           z-index: 0;
//         }
//         .blob-1 { width: 500px; height: 500px; background: #c8dfc8; top: -100px; right: -100px; }
//         .blob-2 { width: 400px; height: 400px; background: #e8d5b0; bottom: -80px; left: -80px; }
//         .blob-3 { width: 300px; height: 300px; background: #d4c5a9; top: 40%; left: 30%; }

//         .content {
//           position: relative;
//           z-index: 1;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 3rem 1.5rem 5rem;
//         }

//         .header {
//           text-align: center;
//           margin-bottom: 2.5rem;
//         }

//         .eyebrow {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.75rem;
//           font-weight: 600;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           color: #7a6b52;
//           margin-bottom: 0.75rem;
//         }

//         .title {
//           font-family: 'Fraunces', serif;
//           font-size: 2.6rem;
//           font-weight: 700;
//           color: #2d3a1e;
//           line-height: 1.15;
//           margin: 0 0 0.75rem;
//         }

//         .subtitle {
//           font-size: 0.95rem;
//           color: #7a6b52;
//           font-weight: 400;
//           line-height: 1.6;
//         }

//         .card {
//           background: rgba(255, 252, 245, 0.85);
//           backdrop-filter: blur(12px);
//           border: 1px solid rgba(210, 195, 170, 0.5);
//           border-radius: 20px;
//           padding: 1.8rem;
//           margin-bottom: 1.2rem;
//           box-shadow: 0 2px 20px rgba(100, 80, 40, 0.06);
//         }

//         .card-title {
//           font-family: 'Fraunces', serif;
//           font-size: 1.05rem;
//           font-weight: 600;
//           color: #2d3a1e;
//           margin: 0 0 1rem;
//         }

//         .checklist {
//           list-style: none;
//           padding: 0;
//           margin: 0 0 1rem;
//           display: flex;
//           flex-direction: column;
//           gap: 0.6rem;
//         }

//         .checklist li {
//           display: flex;
//           align-items: flex-start;
//           gap: 0.7rem;
//           font-size: 0.88rem;
//           color: #5c4f3a;
//           line-height: 1.5;
//         }

//         .checklist-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: #7aab6e;
//           margin-top: 0.45rem;
//           flex-shrink: 0;
//         }

//         .example-text {
//           font-size: 0.82rem;
//           color: #a08c6e;
//           font-style: italic;
//           border-left: 2px solid #c8dfc8;
//           padding-left: 0.8rem;
//           margin: 0;
//           line-height: 1.6;
//         }

//         .controls {
//           display: flex;
//           gap: 0.8rem;
//           margin-bottom: 1rem;
//           flex-wrap: wrap;
//         }

//         .btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.75rem 1.5rem;
//           border-radius: 50px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.88rem;
//           font-weight: 600;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           letter-spacing: 0.01em;
//         }

//         .btn:disabled { opacity: 0.4; cursor: not-allowed; }

//         .btn-record {
//           background: #e07a5f;
//           color: #fff;
//         }
//         .btn-record:hover:not(:disabled) { background: #c96a4f; transform: translateY(-1px); }

//         .btn-stop {
//           background: #2d3a1e;
//           color: #fff;
//           animation: pulse-btn 1.5s ease-in-out infinite;
//         }

//         @keyframes pulse-btn {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(45, 58, 30, 0.3); }
//           50% { box-shadow: 0 0 0 8px rgba(45, 58, 30, 0); }
//         }

//         .btn-submit {
//           background: #4a7c59;
//           color: #fff;
//         }
//         .btn-submit:hover:not(:disabled) { background: #3a6347; transform: translateY(-1px); }

//         .btn-reset {
//           width: 100%;
//           background: transparent;
//           border: 1.5px solid #c8b898;
//           color: #7a6b52;
//           justify-content: center;
//           border-radius: 14px;
//           padding: 0.9rem;
//           margin-top: 0.5rem;
//         }
//         .btn-reset:hover { background: rgba(200, 184, 152, 0.15); }

//         .audio-preview {
//           width: 100%;
//           margin-top: 0.5rem;
//           border-radius: 10px;
//           height: 36px;
//           accent-color: #4a7c59;
//         }

//         .status-msg {
//           font-size: 0.83rem;
//           margin-top: 0.8rem;
//           padding: 0.6rem 0.9rem;
//           border-radius: 10px;
//           display: inline-block;
//         }
//         .status-msg.error { background: #fde8e4; color: #c0392b; }
//         .status-msg.info { background: #e8f0e4; color: #3a6347; }

//         .recording-indicator {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           font-size: 0.82rem;
//           color: #e07a5f;
//           font-weight: 500;
//           margin-top: 0.5rem;
//         }

//         .rec-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: #e07a5f;
//           animation: blink 1s ease-in-out infinite;
//         }

//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.2; }
//         }

//         .btn-exit {
//           width: 100%;
//           background: transparent;
//           border: 1.5px solid #d4c5a9;
//           color: #7a6b52;
//           justify-content: center;
//           border-radius: 14px;
//           padding: 0.9rem;
//           margin-top: 0.6rem;
//         }
//         .btn-exit:hover {
//           background: rgba(212, 197, 169, 0.2);
//         }

//         /* Success */
//         .transcript-card {
//            background: #fef9ec;
//       border: 1px solid #f0c040;
//           border-radius: 16px;
//           padding: 1.2rem 1.4rem;
//           margin-bottom: 1rem;
//         }

//         .transcript-label {
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//            color: #b8960a;
//           margin-bottom: 0.4rem;
//         }

//         .transcript-text {
//           font-size: 0.88rem;
//           color: #6b5500;
//           line-height: 1.6;
//           margin: 0;
//         }

//         .success-card {
//           background: rgba(255, 252, 245, 0.95);
//           border: 1px solid #b8d4b0;
//           border-radius: 20px;
//           padding: 1.8rem;
//           margin-bottom: 1rem;
//         }

//         .success-label {
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           color: #4a7c59;
//           margin-bottom: 0.8rem;
//           display: flex;
//           align-items: center;
//           gap: 0.4rem;
//         }

//         .opp-title {
//           font-family: 'Fraunces', serif;
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #2d3a1e;
//           margin: 0 0 0.3rem;
//         }

//         .opp-meta {
//           font-size: 0.8rem;
//           color: #7a6b52;
//           margin: 0 0 0.8rem;
//         }

//         .opp-desc {
//           font-size: 0.88rem;
//           color: #4a3f30;
//           line-height: 1.65;
//           margin: 0 0 1rem;
//         }

//         .section-label {
//           font-size: 0.72rem;
//           font-weight: 700;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           color: #a08c6e;
//           margin-bottom: 0.5rem;
//         }

//         .tags {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 0.4rem;
//           margin-bottom: 1rem;
//         }

//         .tag {
//           font-size: 0.75rem;
//           background: #e8f0e4;
//           color: #3a6347;
//           padding: 0.25rem 0.7rem;
//           border-radius: 50px;
//           font-weight: 500;
//         }

//         .resp-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//           display: flex;
//           flex-direction: column;
//           gap: 0.4rem;
//         }

//         .resp-list li {
//           font-size: 0.85rem;
//           color: #4a3f30;
//           display: flex;
//           gap: 0.5rem;
//           line-height: 1.5;
//         }

//         .resp-list li::before {
//           content: '→';
//           color: #7aab6e;
//           font-size: 0.8rem;
//           margin-top: 0.1rem;
//           flex-shrink: 0;
//         }
//       `}</style>

//       <main className="upload-page">
//         <div className="blob blob-1" />
//         <div className="blob blob-2" />
//         <div className="blob blob-3" />

//         <div className="content">

//           {/* Header */}
//           <div className="header">
//             <p className="eyebrow">For nonprofits</p>
//             <h1 className="title">Post a Volunteer<br />Opportunity</h1>
//             <p className="subtitle">Record a short voice description.<br />We'll automatically extract the details and save it 🌱</p>
            
//           </div>

//           {/* Prompt card */}
//           <div className="card">
//             <p className="card-title">Please include in your recording</p>
//             <ul className="checklist">
//               {[
//                 'What is the volunteer role?',
//                 'What will volunteers do day-to-day?',
//                 'What skills or experience are helpful?',
//                 'Is it weekly, one-time, or flexible?',
//                 'Where is it located? Is it remote?',
//               ].map((item) => (
//                 <li key={item}>
//                   <span className="checklist-dot" />
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <p className="example-text">
//               "We need weekly tutors for high school students in Vancouver. Patience and good communication skills are helpful."
//             </p>
//           </div>

//           {/* Recording controls */}
//           {status !== 'success' && (
//             <div className="card">
//               <div className="controls">
//                 {!recording ? (
//                   <button
//                     className="btn btn-record"
//                     onClick={startRecording}
//                     disabled={status === 'uploading'}
//                   >
//                     🎙 {audioBlob ? 'Re-record' : 'Start Recording'}
//                   </button>
//                 ) : (
//                   <button className="btn btn-stop" onClick={stopRecording}>
//                     ⏹ Stop
//                   </button>
//                 )}

//                 <button
//                   className="btn btn-submit"
//                   onClick={submitVoice}
//                   disabled={!audioBlob || recording || status === 'uploading'}
//                 >
//                   {status === 'uploading' ? '⏳ Processing…' : '✓ Submit'}
//                 </button>
//               </div>
              

//               {recording && (
//                 <div className="recording-indicator">
//                   <span className="rec-dot" />
//                   Recording in progress…
//                 </div>
//               )}
              

//               {audioBlob && status !== 'uploading' && (
//                 <audio controls src={URL.createObjectURL(audioBlob)} className="audio-preview" />
//               )}

//               {statusMessage && (
//                 <span className={`status-msg ${status === 'error' ? 'error' : 'info'}`}>
//                   {statusMessage}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Success state */}
//           {status === 'success' && opportunity && (
//             <>
//               {transcript && (
//                 <div className="transcript-card">
//                   <p className="transcript-label">What we heard</p>
//                   <p className="transcript-text">{transcript}</p>
//                 </div>
//               )}

//               <div className="success-card">
//                 <p className="success-label">✓ Saved opportunity</p>
//                 <h2 className="opp-title">{opportunity.title}</h2>
//                 <p className="opp-meta">
//                   {opportunity.causeArea} · {opportunity.location} · {opportunity.commitmentType}
//                   {opportunity.isRemote && ' · Remote'}
//                 </p>
//                 <p className="opp-desc">{opportunity.description}</p>

//                 {opportunity.requiredSkills.length > 0 && (
//                   <>
//                     <p className="section-label">Skills needed</p>
//                     <div className="tags">
//                       {opportunity.requiredSkills.map((s) => (
//                         <span key={s} className="tag">{s}</span>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {opportunity.responsibilities.length > 0 && (
//                   <>
//                     <p className="section-label">Responsibilities</p>
//                     <ul className="resp-list">
//                       {opportunity.responsibilities.map((r) => (
//                         <li key={r}>{r}</li>
//                       ))}
//                     </ul>
//                   </>
//                 )}
//               </div>

//               <button className="btn btn-reset" onClick={reset}>
//                 + Post another opportunity
//               </button>
//                <button 
//                 className="btn btn-exit"
//                 onClick={() => router.push('/')}
//               >
//                 Exit to Home
//               </button>
//             </>
//           )}
//         </div>
//       </main>
//     </>
//   )
// }
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const [textInput, setTextInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'recording' | 'done' | 'uploading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [transcript, setTranscript] = useState('')
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)

  const router = useRouter()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
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

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
    }
  }

  // Submit via text description
  const submitText = async () => {
    if (!textInput.trim()) { setStatusMessage('Please enter a description first.'); return }
    setStatus('uploading')
    setStatusMessage('Processing your description…')
    try {
      const res = await fetch(`${API}/api/opportunities/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: textInput }),
      })
      const data = await res.json()
      if (!res.ok) { setStatus('error'); setStatusMessage(data.message || 'Something went wrong.'); return }
      setTranscript(data.transcript || textInput)
      setOpportunity(data.opportunity || null)
      setStatus('success')
      setStatusMessage('Your opportunity has been saved!')
    } catch {
      setStatus('error')
      setStatusMessage('Could not reach the server. Is it running?')
    }
  }

  // Submit via voice recording
  const submitVoice = async () => {
    if (!audioBlob) { setStatusMessage('Please record your opportunity first.'); return }
    setStatus('uploading')
    setStatusMessage('Transcribing and processing your recording…')
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      const res = await fetch(`${API}/api/opportunities/voice`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setStatus('error'); setStatusMessage(data.message || 'Something went wrong.'); return }
      setTranscript(data.transcript || '')
      setOpportunity(data.opportunity || null)
      setStatus('success')
      setStatusMessage('Your opportunity has been saved!')
    } catch {
      setStatus('error')
      setStatusMessage('Could not reach the server. Is it running?')
    }
  }

  const reset = () => {
    setAudioBlob(null)
    setTextInput('')
    setTranscript('')
    setOpportunity(null)
    setStatus('idle')
    setStatusMessage('')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .upload-page {
          min-height: 100vh;
          background: #f5efe6;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 { width: 500px; height: 500px; background: #c8dfc8; top: -100px; right: -100px; }
        .blob-2 { width: 400px; height: 400px; background: #e8d5b0; bottom: -80px; left: -80px; }
        .blob-3 { width: 300px; height: 300px; background: #d4c5a9; top: 40%; left: 30%; }

        .content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a6b52;
          margin-bottom: 0.75rem;
        }

        .title {
          font-family: 'Fraunces', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #2d3a1e;
          line-height: 1.15;
          margin: 0 0 0.75rem;
        }

        .subtitle {
          font-size: 0.95rem;
          color: #7a6b52;
          font-weight: 400;
          line-height: 1.6;
        }

        .card {
          background: rgba(255, 252, 245, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(210, 195, 170, 0.5);
          border-radius: 20px;
          padding: 1.8rem;
          margin-bottom: 1.2rem;
          box-shadow: 0 2px 20px rgba(100, 80, 40, 0.06);
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #2d3a1e;
          margin: 0 0 1rem;
        }

        .checklist {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .checklist li {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-size: 0.88rem;
          color: #5c4f3a;
          line-height: 1.5;
        }

        .checklist-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7aab6e;
          margin-top: 0.45rem;
          flex-shrink: 0;
        }

        .example-text {
          font-size: 0.82rem;
          color: #a08c6e;
          font-style: italic;
          border-left: 2px solid #c8dfc8;
          padding-left: 0.8rem;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Text input card ── */
        .text-textarea {
          width: 100%;
          min-height: 110px;
          background: #faf7f2;
          border: 1.5px solid rgba(210, 195, 170, 0.6);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: #2d3a1e;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
          display: block;
        }

        .text-textarea::placeholder {
          color: #b8a88a;
        }

        .text-textarea:focus {
          border-color: #7aab6e;
          box-shadow: 0 0 0 3px rgba(122, 171, 110, 0.12);
        }

        .text-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .text-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.85rem;
        }

        /* Divider */
        .or-divider {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin: 0 0 1.2rem;
          color: #b8a88a;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .or-divider::before,
        .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(210, 195, 170, 0.55);
        }

        /* Controls */
        .controls {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-record {
          background: #e07a5f;
          color: #fff;
        }
        .btn-record:hover:not(:disabled) { background: #c96a4f; transform: translateY(-1px); }

        .btn-stop {
          background: #2d3a1e;
          color: #fff;
          animation: pulse-btn 1.5s ease-in-out infinite;
        }

        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45, 58, 30, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(45, 58, 30, 0); }
        }

        .btn-submit {
          background: #4a7c59;
          color: #fff;
        }
        .btn-submit:hover:not(:disabled) { background: #3a6347; transform: translateY(-1px); }

        .btn-reset {
          width: 100%;
          background: transparent;
          border: 1.5px solid #c8b898;
          color: #7a6b52;
          justify-content: center;
          border-radius: 14px;
          padding: 0.9rem;
          margin-top: 0.5rem;
        }
        .btn-reset:hover { background: rgba(200, 184, 152, 0.15); }

        .audio-preview {
          width: 100%;
          margin-top: 0.5rem;
          border-radius: 10px;
          height: 36px;
          accent-color: #4a7c59;
        }

        .status-msg {
          font-size: 0.83rem;
          margin-top: 0.8rem;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          display: inline-block;
        }
        .status-msg.error { background: #fde8e4; color: #c0392b; }
        .status-msg.info { background: #e8f0e4; color: #3a6347; }

        .recording-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #e07a5f;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .rec-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e07a5f;
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .btn-exit {
          width: 100%;
          background: transparent;
          border: 1.5px solid #d4c5a9;
          color: #7a6b52;
          justify-content: center;
          border-radius: 14px;
          padding: 0.9rem;
          margin-top: 0.6rem;
        }
        .btn-exit:hover {
          background: rgba(212, 197, 169, 0.2);
        }

        /* Success */
        .transcript-card {
           background: #fef9ec;
      border: 1px solid #f0c040;
          border-radius: 16px;
          padding: 1.2rem 1.4rem;
          margin-bottom: 1rem;
        }

        .transcript-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
           color: #b8960a;
          margin-bottom: 0.4rem;
        }

        .transcript-text {
          font-size: 0.88rem;
          color: #6b5500;
          line-height: 1.6;
          margin: 0;
        }

        .success-card {
          background: rgba(255, 252, 245, 0.95);
          border: 1px solid #b8d4b0;
          border-radius: 20px;
          padding: 1.8rem;
          margin-bottom: 1rem;
        }

        .success-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a7c59;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .opp-title {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3a1e;
          margin: 0 0 0.3rem;
        }

        .opp-meta {
          font-size: 0.8rem;
          color: #7a6b52;
          margin: 0 0 0.8rem;
        }

        .opp-desc {
          font-size: 0.88rem;
          color: #4a3f30;
          line-height: 1.65;
          margin: 0 0 1rem;
        }

        .section-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a08c6e;
          margin-bottom: 0.5rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .tag {
          font-size: 0.75rem;
          background: #e8f0e4;
          color: #3a6347;
          padding: 0.25rem 0.7rem;
          border-radius: 50px;
          font-weight: 500;
        }

        .resp-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .resp-list li {
          font-size: 0.85rem;
          color: #4a3f30;
          display: flex;
          gap: 0.5rem;
          line-height: 1.5;
        }

        .resp-list li::before {
          content: '→';
          color: #7aab6e;
          font-size: 0.8rem;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }
      `}</style>

      <main className="upload-page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="content">

          {/* Header */}
          <div className="header">
            <p className="eyebrow">For nonprofits</p>
            <h1 className="title">Post a Volunteer<br />Opportunity</h1>
            {/* <p className="subtitle">Record a short voice description.<br />We'll automatically extract the details and save it 🌱</p> */}
          </div>

          {/* Prompt card */}
          <div className="card">
            <p className="card-title">Please include in your recording</p>
            <ul className="checklist">
              {[
                'What non-profit do you represent?',
                'What is the volunteer role?',
                'What will volunteers do day-to-day?',
                'What skills or experience are helpful?',
                'Is it weekly, one-time, or flexible?',
                'Where is it located? Is it remote?',
              ].map((item) => (
                <li key={item}>
                  <span className="checklist-dot" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="example-text">
              "We are project Literacy. We need weekly tutors for high school students in Vancouver. Patience and good communication skills are helpful."
            </p>
          </div>

          {/* ── TEXT INPUT CARD (new) ── */}
          {status !== 'success' && (
            <div className="card">
              <p className="card-title">Describe in writing</p>
              <textarea
                className="text-textarea"
                placeholder="e.g. We're looking for weekly math tutors to work with high school students in East Vancouver. Volunteers should be comfortable explaining concepts patiently. No formal teaching experience required — just enthusiasm and reliability."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={status === 'uploading' || recording}
              />
              <div className="text-submit-row">
                <button
                  className="btn btn-submit"
                  onClick={submitText}
                  disabled={!textInput.trim() || status === 'uploading' || recording}
                >
                  {status === 'uploading' ? '⏳ Processing…' : '✓ Submit Text'}
                </button>
              </div>
            </div>
          )}

          {/* OR divider */}
          {status !== 'success' && (
            <div className="or-divider">or record your voice</div>
          )}

          {/* Recording controls */}
          {status !== 'success' && (
            <div className="card">
              <div className="controls">
                {!recording ? (
                  <button
                    className="btn btn-record"
                    onClick={startRecording}
                    disabled={status === 'uploading'}
                  >
                    🎙 {audioBlob ? 'Re-record' : 'Start Recording'}
                  </button>
                ) : (
                  <button className="btn btn-stop" onClick={stopRecording}>
                    ⏹ Stop
                  </button>
                )}

                <button
                  className="btn btn-submit"
                  onClick={submitVoice}
                  disabled={!audioBlob || recording || status === 'uploading'}
                >
                  {status === 'uploading' ? '⏳ Processing…' : '✓ Submit Voice'}
                </button>
              </div>

              {recording && (
                <div className="recording-indicator">
                  <span className="rec-dot" />
                  Recording in progress…
                </div>
              )}

              {audioBlob && status !== 'uploading' && (
                <audio controls src={URL.createObjectURL(audioBlob)} className="audio-preview" />
              )}

              {statusMessage && (
                <span className={`status-msg ${status === 'error' ? 'error' : 'info'}`}>
                  {statusMessage}
                </span>
              )}
            </div>
          )}

          {/* Success state */}
          {status === 'success' && opportunity && (
            <>
              {transcript && (
                <div className="transcript-card">
                  <p className="transcript-label">What we heard</p>
                  <p className="transcript-text">{transcript}</p>
                </div>
              )}

              <div className="success-card">
                <p className="success-label">✓ Saved opportunity</p>
                <h2 className="opp-title">{opportunity.title}</h2>
                <p className="opp-meta">
                  {opportunity.causeArea} · {opportunity.location} · {opportunity.commitmentType}
                  {opportunity.isRemote && ' · Remote'}
                </p>
                <p className="opp-desc">{opportunity.description}</p>

                {opportunity.requiredSkills.length > 0 && (
                  <>
                    <p className="section-label">Skills needed</p>
                    <div className="tags">
                      {opportunity.requiredSkills.map((s) => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                    </div>
                  </>
                )}

                {opportunity.responsibilities.length > 0 && (
                  <>
                    <p className="section-label">Responsibilities</p>
                    <ul className="resp-list">
                      {opportunity.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <button className="btn btn-reset" onClick={reset}>
                + Post another opportunity
              </button>
              <button
                className="btn btn-exit"
                onClick={() => router.push('/')}
              >
                Exit to Home
              </button>
            </>
          )}
        </div>
      </main>
    </>
  )
}