import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getPendingInstructions } from '@/lib/payment/bankTransfer'

// GET /api/admin/bank-transfer  → list pending bank transfer instructions

export async function GET() {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const instructions = await getPendingInstructions(200)
  return NextResponse.json({ instructions, total: instructions.length })
}
