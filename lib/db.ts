import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || ''

let _sql: ReturnType<typeof postgres> | null = null

export function getDb() {
  if (!_sql) {
    _sql = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      max: 5,
      idle_timeout: 20,
    })
  }
  return _sql
}

export async function initDb() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS set_xoi_com_orders (
      id SERIAL PRIMARY KEY,
      ref_code TEXT UNIQUE NOT NULL,
      pancake_order_id TEXT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      address TEXT NOT NULL,
      product TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      note TEXT DEFAULT '',
      payment_status TEXT DEFAULT 'pending',
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function insertSxcOrder(data: {
  refCode: string
  pancakeOrderId?: string
  name: string; phone: string; email: string; address: string
  product: string; quantity: number; totalPrice: number; note?: string
}) {
  const sql = getDb()
  const rows = await sql`
    INSERT INTO set_xoi_com_orders
      (ref_code, pancake_order_id, name, phone, email, address, product, quantity, total_price, note)
    VALUES
      (${data.refCode}, ${data.pancakeOrderId || null}, ${data.name}, ${data.phone},
       ${data.email || ''}, ${data.address}, ${data.product}, ${data.quantity},
       ${data.totalPrice}, ${data.note || ''})
    RETURNING id
  `
  return rows[0].id as number
}

export async function getSxcOrderByRef(refCode: string) {
  const sql = getDb()
  const rows = await sql`SELECT * FROM set_xoi_com_orders WHERE ref_code = ${refCode}`
  return rows[0]
}

export async function confirmSxcPayment(refCode: string) {
  const sql = getDb()
  await sql`
    UPDATE set_xoi_com_orders
    SET payment_status = 'paid', paid_at = NOW()
    WHERE ref_code = ${refCode}
  `
}
