'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InflectionMark } from '@/components/ui/InflectionMark'

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
      router.push('/admin')
    } else {
      setError('Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <InflectionMark size="sm" />
          <p className="label-inst">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-muted text-[0.55rem] tracking-widest">SECRET KEY</label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              disabled={loading}
              className="bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm
                         focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30
                         disabled:opacity-50"
            />
          </div>
          {error && <p className="font-sans text-signal-gold text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !secret}
            className="bg-signal-gold text-obsidian px-8 py-3.5 font-sans text-[0.65rem] tracking-[0.2em]
                       uppercase hover:bg-bone transition-colors duration-200 cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying…' : 'Enter →'}
          </button>
        </form>
      </div>
    </div>
  )
}
