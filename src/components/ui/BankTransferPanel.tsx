'use client'

import { useState, useCallback } from 'react'

interface BankTransferData {
  ref:             string
  currency:        string
  amount:          number
  formattedAmount: string
  rail:            string
  clientLabel:     string
  accountName:     string
  bankName:        string | null
  accountNumber:   string | null
  iban:            string | null
  sortCode:        string | null
  routingNumber:   string | null
  swiftBic:        string | null
  referenceInstructions: string | null
  additionalNotes: string | null
  status:          string
}

interface Props {
  product:  string
  email:    string
  currency: string
  amount:   number
  /** called when instructions are successfully generated */
  onGenerated?: (ref: string) => void
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      className={`ml-2 font-mono text-[0.55rem] px-2 py-0.5 rounded border transition-all cursor-pointer ${
        copied
          ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
          : 'border-white/20 text-muted hover:border-signal-gold/40 hover:text-signal-gold'
      }`}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function DetailRow({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/[0.06]">
      <span className="font-mono text-[0.6rem] text-muted uppercase tracking-widest w-32 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-mono text-xs text-bone font-semibold text-right flex items-center gap-1">
        {value}
        {copyable && <CopyButton text={value} label={label} />}
      </span>
    </div>
  )
}

export function BankTransferPanel({ product, email, currency, amount, onGenerated }: Props) {
  const [state,        setState]        = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [data,         setData]         = useState<BankTransferData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [allCopied,    setAllCopied]    = useState(false)

  const generateInstructions = useCallback(async () => {
    setState('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/payment/bank-transfer/instructions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product, email, currency, amount }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMessage(json.error ?? 'Could not generate bank transfer instructions.')
        setState('error')
        return
      }
      setData(json)
      setState('ready')
      onGenerated?.(json.ref)
    } catch {
      setErrorMessage('Network error. Please try again.')
      setState('error')
    }
  }, [product, email, currency, amount, onGenerated])

  function copyAllDetails() {
    if (!data) return
    const lines = [
      `Payment Reference: ${data.ref}`,
      `Amount: ${data.formattedAmount}`,
      `Transfer Method: ${data.clientLabel}`,
      ``,
      `--- Receiving Account ---`,
      data.accountName    && `Account Name: ${data.accountName}`,
      data.bankName       && `Bank: ${data.bankName}`,
      data.accountNumber  && `Account Number: ${data.accountNumber}`,
      data.iban           && `IBAN: ${data.iban}`,
      data.sortCode       && `Sort Code: ${data.sortCode}`,
      data.routingNumber  && `Routing Number: ${data.routingNumber}`,
      data.swiftBic       && `SWIFT/BIC: ${data.swiftBic}`,
      `Currency: ${data.currency}`,
      ``,
      `⚠ Always include the Payment Reference in your transfer.`,
    ].filter(Boolean).join('\n')

    navigator.clipboard.writeText(lines).then(() => {
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 3000)
    }).catch(() => {})
  }

  // ── Idle state: call-to-action button ───────────────────────────────────
  if (state === 'idle') {
    return (
      <button
        onClick={generateInstructions}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl
                   bg-white/[0.03] border border-white/15 hover:border-signal-gold/40
                   hover:bg-white/[0.05] transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-signal-gold text-lg">🏦</span>
          <div className="text-left">
            <span className="font-mono text-xs text-bone font-bold block">
              {currency === 'GBP' ? 'UK Bank Transfer (FPS)'
               : currency === 'USD' ? 'ACH Bank Transfer'
               : currency === 'EUR' ? 'SEPA Bank Transfer'
               : currency === 'AUD' ? 'Australian Bank Transfer (NPP)'
               : currency === 'CAD' ? 'Canadian Bank Transfer (EFT)'
               : currency === 'DKK' ? 'Danish Bank Transfer'
               : 'International Bank Transfer'}
            </span>
            <span className="font-mono text-[0.6rem] text-muted">
              Receive bank account details · No card required
            </span>
          </div>
        </div>
        <span className="font-mono text-xs text-signal-gold group-hover:text-bone transition-colors">
          View Details →
        </span>
      </button>
    )
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="w-full px-5 py-8 rounded-xl bg-white/[0.03] border border-white/15 text-center">
        <div className="w-5 h-5 border-2 border-signal-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-muted">Generating payment instructions…</p>
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="w-full px-5 py-6 rounded-xl bg-red-950/20 border border-red-900/40">
        <p className="font-sans text-red-400 text-xs mb-3">{errorMessage}</p>
        <button
          onClick={() => setState('idle')}
          className="font-mono text-xs text-signal-gold hover:text-bone transition-colors"
        >
          ← Try again
        </button>
      </div>
    )
  }

  // ── Ready state: full bank details panel ─────────────────────────────────
  if (!data) return null

  return (
    <div className="w-full rounded-xl bg-white/[0.03] border border-signal-gold/30 overflow-hidden">

      {/* Panel header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-signal-gold">🏦</span>
          <span className="font-mono text-xs text-bone font-bold uppercase tracking-wider">
            {data.clientLabel}
          </span>
        </div>
        <span className="font-mono text-[0.6rem] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
          {data.rail}
        </span>
      </div>

      {/* Reference — most prominent */}
      <div className="px-5 py-5 bg-signal-gold/[0.06] border-b border-signal-gold/20">
        <p className="font-mono text-[0.6rem] text-signal-gold uppercase tracking-widest mb-2">
          ⚠ Payment Reference — Include in your transfer
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl text-signal-gold font-bold tracking-wider">
            {data.ref}
          </span>
          <CopyButton text={data.ref} label="reference" />
        </div>
        <p className="font-mono text-[0.55rem] text-muted mt-2">
          You must include this reference exactly — it is how we match your payment.
        </p>
      </div>

      {/* Bank details */}
      <div className="px-5 py-2">
        <DetailRow label="Account Name"  value={data.accountName}   copyable />
        {data.bankName       && <DetailRow label="Bank"            value={data.bankName}       />}
        {data.accountNumber  && <DetailRow label="Account Number"  value={data.accountNumber}  copyable />}
        {data.iban           && <DetailRow label="IBAN"            value={data.iban}           copyable />}
        {data.sortCode       && <DetailRow label="Sort Code"       value={data.sortCode}       copyable />}
        {data.routingNumber  && <DetailRow label="Routing Number"  value={data.routingNumber}  copyable />}
        {data.swiftBic       && <DetailRow label="SWIFT / BIC"     value={data.swiftBic}       copyable />}
        <DetailRow label="Currency"      value={data.currency}      />
        <div className="flex items-center justify-between py-3">
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-widest">Amount Due</span>
          <span className="font-mono text-base text-signal-gold font-bold">{data.formattedAmount}</span>
        </div>
      </div>

      {/* Reference instructions */}
      {data.referenceInstructions && (
        <div className="px-5 py-4 bg-white/[0.02] border-t border-white/[0.06]">
          <p className="font-mono text-[0.6rem] text-muted uppercase tracking-widest mb-1">Instructions</p>
          <p className="font-sans text-xs text-bone/80 leading-relaxed">
            {data.referenceInstructions}
          </p>
        </div>
      )}

      {/* Additional notes */}
      {data.additionalNotes && (
        <div className="px-5 pb-4">
          <p className="font-sans text-[0.65rem] text-muted italic leading-relaxed">
            {data.additionalNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 border-t border-white/10 flex flex-wrap gap-3">
        <button
          onClick={copyAllDetails}
          className={`flex-1 py-2.5 font-mono text-xs uppercase tracking-widest font-bold rounded-lg border transition-all cursor-pointer ${
            allCopied
              ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
              : 'border-signal-gold/40 text-signal-gold hover:bg-signal-gold/10'
          }`}
        >
          {allCopied ? '✓ All Details Copied' : 'Copy All Details'}
        </button>
        <p className="w-full font-sans text-[0.6rem] text-muted text-center">
          Confirmation email with these details has been sent to {email}
        </p>
      </div>
    </div>
  )
}
