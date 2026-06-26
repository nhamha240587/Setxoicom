import { NextRequest, NextResponse } from 'next/server'
import { initDb, getSxcOrderByRef, confirmSxcPayment } from '@/lib/db'
import { notifySxcPaid, notifyPaymentMismatch } from '@/lib/telegram'
import { updatePancakeOrderStatus } from '@/lib/pancake'
import type { SepayWebhookPayload } from '@/lib/sepay'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || ''
    const apiKey = authHeader.replace(/^Apikey\s+/i, '').trim()
    const expectedKey = process.env.SEPAY_API_KEY || ''
    if (!expectedKey || apiKey !== expectedKey) {
      console.warn('[webhook] Từ chối: SEPAY_API_KEY chưa cấu hình hoặc key sai')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await initDb()
    const payload: SepayWebhookPayload = await req.json()
    const content = payload.content || payload.description || ''

    const sxcMatch = content.match(/SXC[A-Z0-9]+/i)
    if (!sxcMatch) {
      return NextResponse.json({ success: true, message: 'Not our transaction' })
    }

    const refCode = sxcMatch[0].toUpperCase()
    const order = await getSxcOrderByRef(refCode).catch(() => null)
    if (!order) return NextResponse.json({ success: true, message: 'SXC order not found' })
    if (order.payment_status === 'paid') return NextResponse.json({ success: true, message: 'Already paid' })

    const received = Number(payload.transferAmount) || 0
    if (received < order.total_price) {
      await notifyPaymentMismatch({ paymentRef: refCode, received, expected: order.total_price, content }).catch(console.error)
      return NextResponse.json({ success: true, message: 'Underpaid' })
    }

    await confirmSxcPayment(refCode)

    let pancakeUpdated = false
    if (order.pancake_order_id) {
      const updated = await updatePancakeOrderStatus(order.pancake_order_id, 9).catch(() => null)
      pancakeUpdated = !!updated
    }

    await notifySxcPaid({
      name: order.name, phone: order.phone,
      product: order.product, quantity: order.quantity, totalPrice: order.total_price,
      refCode, pancakeOrderId: order.pancake_order_id || undefined,
      pancakeUpdated,
    }).catch(console.error)

    return NextResponse.json({ success: true, refCode })
  } catch (err) {
    console.error('[payment-webhook]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
