'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface BankAccount {
  id:                    string
  currency:              string
  rail:                  string
  status:                'active' | 'coming_soon' | 'requested' | 'disabled'
  account_name:          string
  bank_name:             string | null
  account_number:        string | null
  iban:                  string | null
  sort_code:             string | null
  routing_number:        string | null
  swift_bic:             string | null
  reference_instructions: string | null
  additional_notes:      string | null
  created_at:            string
}

interface BankInstruction {
  id:                 string
  reconciliation_ref: string
  product:            string
  email:              string
  currency:           string
  amount:             number
  status:             string
  created_at:         string
  notes:              string | null
  client_confirmed_at:    string | null
  client_sender_bank:     string | null
  client_transaction_ref: string | null
  client_notes:           string | null
}

// ── Style helpers ────────────────────────────────────────────────────────────

const inputCls = 'w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/30'

const STATUS_COLORS: Record<string, string> = {
  active:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  coming_soon:  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  requested:    'text-amber-400 bg-amber-500/10 border-amber-500/30',
  disabled:     'text-muted bg-white/[0.03] border-white/10',
  pending:      'text-amber-400 bg-amber-500/10 border-amber-500/30',
  received:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  settled:      'text-blue-400 bg-blue-500/10 border-blue-500/30',
  manually_reconciled: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? 'text-muted bg-white/[0.02] border-white/10'
  return (
    <span className={`font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

// ── Blank account form ────────────────────────────────────────────────────────

const BLANK_FORM = {
  currency: '', rail: '', status: 'active',
  account_name: '', bank_name: '', account_number: '',
  iban: '', sort_code: '', routing_number: '', swift_bic: '',
  reference_instructions: '', additional_notes: '',
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PaymentsTab() {
  const [subTab, setSubTab] = useState<'accounts' | 'reconcile'>('accounts')

  // Accounts state
  const [accounts,      setAccounts]      = useState<BankAccount[]>([])
  const [acctLoading,   setAcctLoading]   = useState(false)
  const [showAddForm,   setShowAddForm]   = useState(false)
  const [editingId,     setEditingId]     = useState<string | null>(null)
  const [form,          setForm]          = useState(BLANK_FORM)
  const [acctMsg,       setAcctMsg]       = useState('')
  const [acctErr,       setAcctErr]       = useState('')

  // Reconciliation state
  const [instructions,  setInstructions]  = useState<BankInstruction[]>([])
  const [reconLoading,  setReconLoading]  = useState(false)
  const [reconMsg,      setReconMsg]      = useState<Record<string, string>>({})
  const [reconNotes,    setReconNotes]    = useState<Record<string, string>>({})

  // ── Load data ──────────────────────────────────────────────────────────────

  const loadAccounts = useCallback(async () => {
    setAcctLoading(true)
    try {
      const r = await fetch('/api/admin/bank-accounts')
      const d = await r.json()
      setAccounts(d.accounts ?? [])
    } catch { setAcctErr('Failed to load accounts.') }
    setAcctLoading(false)
  }, [])

  const loadInstructions = useCallback(async () => {
    setReconLoading(true)
    try {
      const r = await fetch('/api/admin/bank-transfer')
      const d = await r.json()
      setInstructions(d.instructions ?? [])
    } catch {}
    setReconLoading(false)
  }, [])

  useEffect(() => { loadAccounts() },     [loadAccounts])
  useEffect(() => { loadInstructions() }, [loadInstructions])

  // ── Account CRUD ──────────────────────────────────────────────────────────

  async function saveAccount() {
    setAcctErr('')
    setAcctMsg('')
    if (!form.currency || !form.rail || !form.account_name) {
      setAcctErr('Currency, Rail, and Account Name are required.')
      return
    }

    const url     = editingId ? `/api/admin/bank-accounts/${editingId}` : '/api/admin/bank-accounts'
    const method  = editingId ? 'PATCH' : 'POST'
    const res     = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) { setAcctErr(data.error ?? 'Failed to save.'); return }
    setAcctMsg(editingId ? 'Account updated.' : 'Account created.')
    setShowAddForm(false)
    setEditingId(null)
    setForm(BLANK_FORM)
    loadAccounts()
  }

  async function disableAccount(id: string, currency: string) {
    if (!confirm(`Disable the ${currency} account? Clients will no longer see this bank transfer option.`)) return
    const res = await fetch(`/api/admin/bank-accounts/${id}`, { method: 'DELETE' })
    if (res.ok) { setAcctMsg(`${currency} account disabled.`); loadAccounts() }
    else         setAcctErr('Failed to disable account.')
  }

  async function enableAccount(id: string) {
    const res = await fetch(`/api/admin/bank-accounts/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: 'active' }),
    })
    if (res.ok) { setAcctMsg('Account enabled.'); loadAccounts() }
    else         setAcctErr('Failed to enable account.')
  }

  function startEdit(acc: BankAccount) {
    setEditingId(acc.id)
    setForm({
      currency:               acc.currency,
      rail:                   acc.rail,
      status:                 acc.status,
      account_name:           acc.account_name,
      bank_name:              acc.bank_name ?? '',
      account_number:         acc.account_number ?? '',
      iban:                   acc.iban ?? '',
      sort_code:              acc.sort_code ?? '',
      routing_number:         acc.routing_number ?? '',
      swift_bic:              acc.swift_bic ?? '',
      reference_instructions: acc.reference_instructions ?? '',
      additional_notes:       acc.additional_notes ?? '',
    })
    setShowAddForm(true)
  }

  // ── Reconciliation ────────────────────────────────────────────────────────

  async function reconcile(ref: string) {
    if (!confirm(`Mark ${ref} as manually reconciled? This will insert a payment record.`)) return
    const res = await fetch('/api/admin/bank-transfer/reconcile', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ref, notes: reconNotes[ref] ?? '' }),
    })
    const data = await res.json()
    if (res.ok) {
      setReconMsg(prev => ({ ...prev, [ref]: '✓ Reconciled' }))
      setInstructions(prev => prev.filter(i => i.reconciliation_ref !== ref))
    } else {
      setReconMsg(prev => ({ ...prev, [ref]: data.error ?? 'Failed.' }))
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 lg:px-12 py-8">

      {/* Sub-tab navigation */}
      <div className="flex gap-2 mb-8">
        {([
          { key: 'accounts',   label: '🏦 Receiving Accounts' },
          { key: 'reconcile',  label: '📋 Reconciliation Queue' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              subTab === t.key
                ? 'border-signal-gold/50 bg-signal-gold/10 text-signal-gold'
                : 'border-white/10 text-muted hover:border-white/20 hover:text-bone'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACCOUNTS SUB-TAB                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold">
                INTERNATIONAL BANK ACCOUNTS
              </h2>
              <p className="font-sans text-muted text-xs mt-1">
                Configure receiving accounts from your Razorpay MoneySaver dashboard.
                Active accounts are shown to clients when invoice currency matches.
              </p>
            </div>
            <button
              onClick={() => { setShowAddForm(v => !v); setEditingId(null); setForm(BLANK_FORM) }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian font-mono text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:brightness-110 transition-all shadow-md whitespace-nowrap"
            >
              + Add Account
            </button>
          </div>

          {acctMsg && <p className="font-sans text-emerald-400 text-xs p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">{acctMsg}</p>}
          {acctErr && <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/30 border border-red-900/40">{acctErr}</p>}

          {/* Add / Edit form */}
          {showAddForm && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-signal-gold/20 space-y-4">
              <h3 className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold">
                {editingId ? 'EDIT ACCOUNT' : 'NEW RECEIVING ACCOUNT'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Currency *</label>
                  <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value.toUpperCase() }))} placeholder="GBP" maxLength={3} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Transfer Rail *</label>
                  <select value={form.rail} onChange={e => setForm(f => ({ ...f, rail: e.target.value }))} className={inputCls}>
                    <option value="">Select rail...</option>
                    {['FPS','ACH','SEPA','NPP','EFT','LOCAL','SWIFT'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Status *</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                    <option value="active">Active</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="requested">Requested</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Account Name *</label>
                  <input value={form.account_name} onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))} placeholder="Ripple Nexus" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Bank Name</label>
                  <input value={form.bank_name} onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))} placeholder="Barclays" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Account Number</label>
                  <input value={form.account_number} onChange={e => setForm(f => ({ ...f, account_number: e.target.value }))} placeholder="12345678" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">IBAN</label>
                  <input value={form.iban} onChange={e => setForm(f => ({ ...f, iban: e.target.value }))} placeholder="GB29 NWBK 6016 1331 9268 19" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Sort Code</label>
                  <input value={form.sort_code} onChange={e => setForm(f => ({ ...f, sort_code: e.target.value }))} placeholder="20-00-00" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Routing Number (ACH)</label>
                  <input value={form.routing_number} onChange={e => setForm(f => ({ ...f, routing_number: e.target.value }))} placeholder="021000089" className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">SWIFT / BIC</label>
                  <input value={form.swift_bic} onChange={e => setForm(f => ({ ...f, swift_bic: e.target.value }))} placeholder="BARCGB22XXX" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Reference Instructions (shown to client)</label>
                <textarea value={form.reference_instructions} onChange={e => setForm(f => ({ ...f, reference_instructions: e.target.value }))} rows={2} placeholder="Include the RN- reference in the payment reference/description field." className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block font-mono text-[0.6rem] text-muted uppercase tracking-wider mb-1">Additional Notes</label>
                <textarea value={form.additional_notes} onChange={e => setForm(f => ({ ...f, additional_notes: e.target.value }))} rows={2} placeholder="e.g. Transfers typically take 1-2 business days." className={`${inputCls} resize-none`} />
              </div>
              <div className="flex gap-3">
                <button onClick={saveAccount} className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian font-mono text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:brightness-110 transition-all shadow-md">
                  {editingId ? 'Save Changes →' : 'Create Account →'}
                </button>
                <button onClick={() => { setShowAddForm(false); setEditingId(null); setForm(BLANK_FORM) }} className="px-5 py-2.5 border border-white/15 text-muted font-mono text-xs uppercase tracking-widest rounded-full cursor-pointer hover:border-white/30 hover:text-bone transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Account list */}
          {acctLoading ? (
            <div className="py-12 text-center">
              <div className="w-5 h-5 border-2 border-signal-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
              <p className="font-sans text-muted text-sm">No accounts configured yet.</p>
              <p className="font-mono text-xs text-signal-gold mt-2">
                Add your first receiving account from your Razorpay MoneySaver dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-base text-bone font-bold">{acc.currency}</span>
                        <span className="font-mono text-[0.6rem] text-muted border border-white/10 px-2 py-0.5 rounded">{acc.rail}</span>
                        <StatusBadge status={acc.status} />
                      </div>
                      <p className="font-sans text-xs text-muted">{acc.account_name}{acc.bank_name ? ` · ${acc.bank_name}` : ''}</p>
                      {acc.account_number && <p className="font-mono text-[0.6rem] text-muted/60 mt-0.5">Acct: {acc.account_number}</p>}
                      {acc.iban           && <p className="font-mono text-[0.6rem] text-muted/60">IBAN: {acc.iban}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => startEdit(acc)} className="px-4 py-1.5 font-mono text-xs text-signal-gold border border-signal-gold/30 rounded-full hover:bg-signal-gold/10 transition-all cursor-pointer">
                      Edit
                    </button>
                    {acc.status === 'disabled' ? (
                      <button onClick={() => enableAccount(acc.id)} className="px-4 py-1.5 font-mono text-xs text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-500/10 transition-all cursor-pointer">
                        Enable
                      </button>
                    ) : (
                      <button onClick={() => disableAccount(acc.id, acc.currency)} className="px-4 py-1.5 font-mono text-xs text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-all cursor-pointer">
                        Disable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RECONCILIATION SUB-TAB                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'reconcile' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold">
                PENDING BANK TRANSFERS
              </h2>
              <p className="font-sans text-muted text-xs mt-1">
                Instructions generated for clients who have not yet completed payment.
                Mark as reconciled once funds are received.
              </p>
            </div>
            <button onClick={loadInstructions} className="font-mono text-xs text-muted hover:text-signal-gold transition-colors cursor-pointer">
              ↻ Refresh
            </button>
          </div>

          {reconLoading ? (
            <div className="py-12 text-center">
              <div className="w-5 h-5 border-2 border-signal-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : instructions.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
              <p className="font-sans text-muted text-sm">No pending bank transfers.</p>
              <p className="font-mono text-xs text-signal-gold mt-2">All clear. ✓</p>
            </div>
          ) : (
            <div className="space-y-3">
              {instructions.map(inst => (
                <div key={inst.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-signal-gold font-bold tracking-wider">{inst.reconciliation_ref}</span>
                        <StatusBadge status={inst.status} />
                        {inst.client_confirmed_at && (
                          <span className="font-mono text-[0.55rem] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Client Sent ✓
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-bone">{inst.email}</p>
                      <p className="font-mono text-[0.6rem] text-muted mt-0.5">
                        {inst.currency} {Number(inst.amount).toFixed(2)} · {inst.product} · {new Date(inst.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                      </p>
                    </div>
                    {reconMsg[inst.reconciliation_ref] && (
                      <span className="font-mono text-xs text-emerald-400">{reconMsg[inst.reconciliation_ref]}</span>
                    )}
                  </div>
                  
                  {/* Client Confirmation Details */}
                  {inst.client_confirmed_at && (
                    <div className="p-3 bg-white/[0.02] border border-emerald-500/20 rounded-lg">
                      <p className="font-mono text-[0.6rem] text-emerald-400/80 uppercase tracking-widest mb-1.5">Transfer Details from Client</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-mono text-[0.55rem] text-muted uppercase">Sender Bank</p>
                          <p className="font-sans text-xs text-bone">{inst.client_sender_bank}</p>
                        </div>
                        {inst.client_transaction_ref && (
                          <div>
                            <p className="font-mono text-[0.55rem] text-muted uppercase">Transaction Ref</p>
                            <p className="font-sans text-xs text-bone">{inst.client_transaction_ref}</p>
                          </div>
                        )}
                        {inst.client_notes && (
                          <div className="col-span-2">
                            <p className="font-mono text-[0.55rem] text-muted uppercase">Notes</p>
                            <p className="font-sans text-xs text-bone italic">{inst.client_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      value={reconNotes[inst.reconciliation_ref] ?? ''}
                      onChange={e => setReconNotes(prev => ({ ...prev, [inst.reconciliation_ref]: e.target.value }))}
                      placeholder="Admin notes (optional)"
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/40"
                    />
                    <button
                      onClick={() => reconcile(inst.reconciliation_ref)}
                      className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian font-mono text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:brightness-110 transition-all shadow-md whitespace-nowrap"
                    >
                      Mark Received ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
