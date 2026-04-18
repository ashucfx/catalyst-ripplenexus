'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import type { GeoResponse } from '@/lib/geo'

type Props = {
  product:     'audit'
  email:       string
  onSuccess:   (data: { method: 'razorpay' | 'paypal'; id: string }) => void
  onError:     (msg: string) => void
  disabled?:   boolean
}

// Razorpay checkout.js types
declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
    paypal?:  {
      Buttons: (opts: Record<string, unknown>) => { render(id: string): void }
    }
  }
}

export function PaymentButton({ product, email, onSuccess, onError, disabled }: Props) {
  const [geo,     setGeo]     = useState<GeoResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/geo').then(r => r.json()).then(setGeo).catch(() => {
      setGeo({ country: 'US', isIndia: false, currency: 'USD', paymentMethod: 'paypal' })
    })
  }, [])

  // ── Razorpay ────────────────────────────────────────────────────────────
  async function handleRazorpay() {
    setLoading(true)
    try {
      const res  = await fetch('/api/payment/razorpay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product, email }),
      })
      const data = await res.json()
      if (!res.ok) { onError(data.error ?? 'Could not create order.'); return }

      const options = {
        key:          data.keyId,
        amount:       data.amount,
        currency:     data.currency,
        order_id:     data.orderId,
        name:         'Catalyst',
        description:  'Market Value Audit',
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
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      onError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── PayPal — rendered into #paypal-button-container once SDK loads ───────
  function initPayPal() {
    if (!window.paypal) return
    window.paypal.Buttons({
      createOrder: async () => {
        const res  = await fetch('/api/payment/paypal/create', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ product }),
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
          body:    JSON.stringify({ orderId: data.orderID, product }),
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

  if (!geo) {
    return (
      <div className="h-12 bg-graphite animate-pulse" />
    )
  }

  if (geo.paymentMethod === 'razorpay') {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <button
          onClick={handleRazorpay}
          disabled={disabled || loading}
          className="w-full bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.7rem]
                     tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                     cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Opening checkout…' : 'Pay ₹15,000 — Book Audit →'}
        </button>
        <p className="font-mono text-muted text-[0.6rem] tracking-widest text-center mt-2">
          UPI · Cards · Net Banking · Wallets — powered by Razorpay
        </p>
      </>
    )
  }

  // PayPal path
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  return (
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
        Cards · PayPal — secure international checkout · $499 USD
      </p>
    </>
  )
}
