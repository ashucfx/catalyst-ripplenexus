'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [secret,  setSecret]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/auth', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ secret }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid secret key credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian grain flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/15 shadow-2xl backdrop-blur-xl text-center">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-4 h-4 bg-signal-gold rotate-45 rounded-sm" />
          <span className="font-serif text-xl font-bold tracking-wider text-bone">CATALYST</span>
          <span className="font-mono text-[0.65rem] text-signal-gold border border-signal-gold/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold">
            ADMIN
          </span>
        </div>

        <h1 className="display-card text-2xl text-bone mb-2">
          Executive Portal Access
        </h1>
        <p className="font-serif text-muted text-xs sm:text-sm mb-8 leading-relaxed">
          Enter your administrative secret key to authenticate your session.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left" noValidate>
          <div>
            <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
              ADMINISTRATIVE SECRET KEY
            </label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="••••••••••••••••"
              autoComplete="current-password"
              disabled={loading}
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/30 disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/40 border border-red-900/50">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !secret}
            className="mt-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] py-4 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-md"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER ADMIN PORTAL →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
          <Link href="/" className="hover:text-bone transition-colors">
            ← Return to Catalyst Web
          </Link>
          <span className="text-[0.6rem] uppercase tracking-widest text-emerald-400">
            🔒 Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}
