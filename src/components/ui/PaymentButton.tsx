'use client'

import { useState, useEffect, useRef } from 'react'
import Script from 'next/script'
import type { GeoResponse } from '@/lib/geo'
import { BankTransferPanel } from '@/components/ui/BankTransferPanel'

type Props = {
  product:      string   // 'audit' | 'booking:UUID'
  email:        string
  onSuccess:    (data: { method: 'razorpay' | 'razorpay_intl' | 'paypal' | 'bank_transfer'; id: string }) => void
  onError:      (msg: string) => void
  disabled?:    boolean
  labelINR?:    string   // override button label for India flow
  labelUSD?:    string   // override section label for international flow
  description?: string  // shown in Razorpay modal; defaults to product name
  /** For international Razorpay card: amount in invoice currency */
  amountIntl?:  number
  /** For international Razorpay card: invoice currency (e.g. 'GBP') */
  currencyIntl?: string
}

// Razorpay checkout.js types
declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => { render(id: string): void }
    }
  }
}

// ── Method selection tab type ───────────────────────────────────────────────
type IntlTab = 'card' | 'paypal' | 'bank'

export function PaymentButton({
  product, email, onSuccess, onError, disabled,
  labelINR, labelUSD, description,
  amountIntl, currencyIntl,
}: Props) {
  const [geo,           setGeo]           = useState<GeoResponse | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [activeTab,     setActiveTab]     = useState<IntlTab>('card')
  const [bankAvailable, setBankAvailable] = useState(true)
  const [bankRail,      setBankRail]      = useState<string>('')
  const paypalRef = useRef(false)

  const intlCurrency = currencyIntl ?? geo?.currency ?? 'USD'

  useEffect(() => {
    fetch('/api/geo').then(r => r.json()).then(setGeo).catch(() => {
      setGeo({ country: 'US', isIndia: false, band: 'A', currency: 'USD', paymentMethod: 'paypal' })
    })
  }, [])

  useEffect(() => {
    if (geo && !geo.isIndia) {
      fetch(`/api/payment/methods?country=${geo.country}&currency=${intlCurrency}`)
        .then(r => r.json())
        .then(data => {
          if (data?.bankTransfer) {
            setBankAvailable(data.bankTransfer.available)
            if (data.bankTransfer.rail) setBankRail(data.bankTransfer.rail)
          }
        })
        .catch(() => {})
    }
  }, [geo, intlCurrency])

  // ── Razorpay INR (India) ──────────────────────────────────────────────────
  async function handleRazorpayINR() {
    setLoading(true)
    try {
      const res  = await fetch('/api/payment/razorpay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product, email, amount: amountIntl, currency: 'INR' }),
      })
      const data = await res.json()
      if (!res.ok) { onError(data.error ?? 'Could not create order.'); return }

      const options = {
        key:          data.keyId,
        amount:       data.amount,
        currency:     data.currency,
        order_id:     data.orderId,
        name:         'Catalyst by Ripple Nexus',
        description:  description ?? 'Executive Career Services',
        prefill:      { email },
        theme:        { color: '#B8935B' },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id:   string
          razorpay_signature:  string
        }) => {
          const verify = await fetch('/api/payment/razorpay/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              orderId:   response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              email,
              product,
            }),
          })
          const vData = await verify.json()
          if (!verify.ok) { onError(vData.error ?? 'Verification failed.'); return }
          onSuccess({ method: 'razorpay', id: response.razorpay_payment_id })
        },
        modal: { ondismiss: () => setLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      onError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Razorpay International Card ───────────────────────────────────────────
  async function handleRazorpayIntl() {
    if (!amountIntl || !currencyIntl) {
      onError('Payment amount not set.')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch('/api/payment/razorpay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product, email, currency: currencyIntl, amount: amountIntl }),
      })
      const data = await res.json()
      if (!res.ok) { onError(data.error ?? 'Could not create order.'); return }

      const options = {
        key:          data.keyId,
        amount:       data.amount,
        currency:     data.currency,
        order_id:     data.orderId,
        name:         'Catalyst by Ripple Nexus',
        description:  description ?? 'Executive Career Services',
        prefill:      { email },
        theme:        { color: '#B8935B' },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id:   string
          razorpay_signature:  string
        }) => {
          const verify = await fetch('/api/payment/razorpay/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              orderId:   response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              email,
              product,
              currency:  currencyIntl,
              amount:    amountIntl,
            }),
          })
          const vData = await verify.json()
          if (!verify.ok) { onError(vData.error ?? 'Verification failed.'); return }
          onSuccess({ method: 'razorpay_intl', id: response.razorpay_payment_id })
        },
        modal: { ondismiss: () => setLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      onError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── PayPal ────────────────────────────────────────────────────────────────
  function initPayPal() {
    if (!window.paypal || paypalRef.current) return
    paypalRef.current = true
    window.paypal.Buttons({
      createOrder: async () => {
        const res  = await fetch('/api/payment/paypal/create', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ product, email, amount: amountIntl, description }),
        })
        const data = await res.json()
        if (!res.ok) { onError(data.error ?? 'Could not create order.'); throw new Error() }
        return data.orderId
      },
      onApprove: async (data: { orderID: string }) => {
        setLoading(true)
        const res  = await fetch('/api/payment/paypal/capture', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ orderId: data.orderID, product, email }),
        })
        const cap = await res.json()
        setLoading(false)
        if (!res.ok) { onError(cap.error ?? 'Capture failed.'); return }
        onSuccess({ method: 'paypal', id: cap.captureId })
      },
      onError: () => {
        setLoading(false)
        onError('PayPal encountered an error. Please try again.')
      },
      style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', height: 48 },
    }).render('#paypal-button-container')
  }

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (!geo) {
    return <div className="h-14 rounded-xl bg-graphite/60 animate-pulse" />
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INDIA FLOW — Razorpay only (unchanged from original)
  // ══════════════════════════════════════════════════════════════════════════
  if (geo.isIndia) {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <button
          onClick={handleRazorpayINR}
          disabled={disabled || loading}
          className="w-full bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.7rem]
                     tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                     cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
        >
          {loading ? 'Opening checkout…' : (labelINR ?? 'Pay — Confirm Booking →')}
        </button>
        <p className="font-mono text-muted text-[0.6rem] tracking-widest text-center mt-2">
          UPI · Cards · Net Banking · Wallets — powered by Razorpay
        </p>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL FLOW — 3 payment methods
  // ══════════════════════════════════════════════════════════════════════════
  const clientId   = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  const tabs: { key: IntlTab; label: string; icon: string }[] = [
    { key: 'card',   label: 'Card',          icon: '💳' },
    { key: 'paypal', label: 'PayPal',        icon: '🅿' },
    ...(bankAvailable ? [{ key: 'bank' as IntlTab, label: bankRail ? `${bankRail} Bank` : 'Bank Transfer', icon: '🏦' }] : []),
  ]

  return (
    <div className="space-y-4">
      {/* Section label */}
      <p className="font-mono text-[0.6rem] text-muted tracking-widest uppercase">
        {labelUSD ?? 'Select payment method'}
      </p>

      {/* Method tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border font-mono text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-signal-gold/60 bg-signal-gold/10 text-signal-gold'
                : 'border-white/10 bg-white/[0.02] text-muted hover:border-white/20 hover:text-bone'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-2">

        {/* ── Card via Razorpay ── */}
        {activeTab === 'card' && (
          <>
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
            />
            <button
              onClick={handleRazorpayIntl}
              disabled={disabled || loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844]
                         text-obsidian px-8 py-4 font-mono text-xs font-bold
                         tracking-widest uppercase rounded-xl hover:brightness-110
                         transition-all cursor-pointer disabled:opacity-60
                         disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Opening checkout…' : `Pay by Card →`}
            </button>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest text-center mt-2">
              Visa · Mastercard · Amex — powered by Razorpay
            </p>
          </>
        )}

        {/* ── PayPal ── */}
        {activeTab === 'paypal' && (
          <>
            {clientId && (
              <Script
                src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`}
                strategy="lazyOnload"
                onLoad={initPayPal}
              />
            )}
            <div id="paypal-button-container" className="w-full min-h-[48px]" />
            <p className="font-mono text-muted text-[0.6rem] tracking-widest text-center mt-2">
              PayPal · Secure · USD checkout
            </p>
          </>
        )}

        {/* ── Bank Transfer ── */}
        {activeTab === 'bank' && (
          <BankTransferPanel
            product={product}
            email={email}
            currency={intlCurrency}
            amount={amountIntl ?? 0}
            onGenerated={(ref) => {
              onSuccess({ method: 'bank_transfer', id: ref })
            }}
          />
        )}

      </div>
    </div>
  )
}
