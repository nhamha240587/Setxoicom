'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Image paths ──────────────────────────────────────────────────────────────
const SP = '/images/set-xoi-com/san-pham/'
const FB = '/images/set-xoi-com/feedback/'
const UT = '/images/set-xoi-com/uy-tin/'

const SAN_PHAM = [
  { src: SP + 'z7728489506719_b50b067d25c4d1ac0ef7f35b9a862580.jpg', label: 'Sét Xôi Cốm Bếp Cô Hạ' },
  { src: SP + 'IMG_0197.JPG', label: 'Xôi cốm thơm mát lá sen' },
  { src: SP + '617872378_1514279540421659_2701416559612899466_n.jpg', label: 'Cốm Mễ Trì tươi ngon' },
  { src: SP + '622855087_1523645659485047_4399047496853641822_n.jpg', label: 'Đóng gói sang trọng' },
  { src: SP + '722705000_1642171887632423_3979564310912375133_n.jpg', label: 'Quà biếu ý nghĩa' },
  { src: SP + 'IMG_1068 (1).PNG', label: 'Sét hoàn chỉnh từ Bếp Cô Hạ' },
]

const HERO_IMG = SP + 'z7728489506719_b50b067d25c4d1ac0ef7f35b9a862580.jpg'

const FEEDBACKS = [
  FB + 'z7730335364567_8d674d48fd66cc3792b6cd5dd512ac95.jpg',
  FB + 'z7730335370751_df22a8c555a02a9a8cfafbd9ed35294c.jpg',
  FB + 'z7730335376276_86e6d248c2574b44963ccacb9bf79d9c.jpg',
  FB + 'z7730335379270_5abaa2023af63abe18029c03fb0fa0fd.jpg',
  FB + 'z7730335387606_b3cbbe82373ae5d74c0efde5d445f98b.jpg',
  FB + 'z7730335393135_a8cf877dffa056d049b6c1bd7ffc0bc6.jpg',
  FB + 'z7730335402764_f2a3a3fe8394df70bd971a592d9a27de.jpg',
  FB + 'z7730335404328_21071e204a4e6326842543eb7e15ef02.jpg',
  FB + 'z7730335422085_4ee6a58b529dbb55e16faaa1530c9e5f.jpg',
  FB + 'z7730335431987_5c21fb601b078752332c3665a63a0d74.jpg',
]

const UY_TIN = [
  { src: UT + 'z7730295670885_99988c6c25c064abd59e3e9617ff8726.jpg', label: 'Kênh Facebook Bếp Cô Hạ' },
  { src: UT + 'z7730296537408_96f9db97736016c93f9a740985d04d41.jpg', label: 'Cộng đồng Hacofood' },
  { src: UT + 'z7730296545695_e2cd4f391ad3a8ae76f1e8d8d6651042.jpg', label: 'TikTok & YouTube viral' },
  { src: UT + 'z7730387539278_d0ddcc6f279597ec3196aeae9a0af2ec.jpg', label: 'Hàng triệu lượt xem' },
]

// TODO: CÀI GIÁ THẬT (khớp với const PRICE trong app/api/order/route.ts)
const PRICE = 85000

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  name: string; phone: string; email: string; address: string
  quantity: number; note: string
}

interface PaymentData {
  refCode: string
  totalPrice: number
  productLabel: string
  qr: { bankAccount: string; bankCode: string; accountName: string; amount: number; content: string; qrUrl: string }
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  const m = Math.floor(left / 60).toString().padStart(2, '0')
  const s = (left % 60).toString().padStart(2, '0')
  return <span className={left < 120 ? 'text-red-500 font-bold' : 'font-bold text-[#3F6B2E]'}>{m}:{s}</span>
}

// ─── Payment Step ─────────────────────────────────────────────────────────────
function PaymentStep({ data, form }: { data: PaymentData; form: FormState }) {
  const [copied, setCopied] = useState<'ref' | 'amount' | null>(null)
  function copy(text: string, type: 'ref' | 'amount') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-[#3F6B2E] font-extrabold text-lg mb-0.5">Bước 2: Chuyển khoản để xác nhận đơn</p>
        <p className="text-gray-500 text-sm">Quét QR hoặc chuyển khoản thủ công trong <Countdown seconds={30 * 60} /></p>
      </div>

      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.qr.qrUrl} alt="QR chuyển khoản"
          className="w-52 h-52 rounded-2xl border-4 border-[#3F6B2E] shadow-lg object-contain bg-white" />
      </div>

      <div className="bg-[#F4FAF0] border border-green-200 rounded-2xl p-4 space-y-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Ngân hàng</span>
          <span className="font-bold">{data.qr.bankCode} – {data.qr.accountName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Số tài khoản</span>
          <span className="font-bold font-mono">{data.qr.bankAccount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Số tiền</span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#C9832E] text-base">{fmt(data.totalPrice)}</span>
            <button onClick={() => copy(String(data.totalPrice), 'amount')}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-0.5 rounded-lg transition-colors">
              {copied === 'amount' ? '✓ Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-green-100 pt-2.5">
          <span className="text-gray-500">Nội dung CK <span className="text-red-500 font-bold">(bắt buộc)</span></span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-mono text-[#3F6B2E]">{data.refCode}</span>
            <button onClick={() => copy(data.refCode, 'ref')}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-lg transition-colors">
              {copied === 'ref' ? '✓ Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        ⚠️ Nhập <strong>đúng nội dung</strong> <code className="bg-amber-100 px-1 rounded">{data.refCode}</code> khi chuyển khoản – hệ thống tự động xác nhận và đơn hàng chuyển ngay sang trạng thái <strong>Chờ chuyển hàng</strong>.
      </div>

      <div className="text-center text-sm text-gray-400 pt-1">
        <p>Đơn của <strong>{form.name}</strong> · {data.productLabel} × {form.quantity}</p>
        <p className="mt-1">Sau khi chuyển khoản, đơn được xử lý tự động – không cần chờ xác nhận.</p>
      </div>
    </div>
  )
}

// ─── Order Form ───────────────────────────────────────────────────────────────
function OrderForm() {
  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '', address: '',
    quantity: 1, note: '',
  })
  const [step, setStep] = useState<'idle' | 'loading' | 'payment' | 'error'>('idle')
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const total = PRICE * form.quantity

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lòng điền đủ: Họ tên, Số điện thoại, Địa chỉ')
      return
    }
    setStep('loading')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi')
      setPaymentData(data)
      setStep('payment')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      setStep('error')
    }
  }

  if (step === 'payment' && paymentData) {
    return <PaymentStep data={paymentData} form={form} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quantity */}
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Số lượng *</label>
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => set('quantity', Math.max(1, form.quantity - 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-xl font-bold hover:border-[#7BA05B] transition-colors flex items-center justify-center">
            −
          </button>
          <span className="w-10 text-center font-bold text-xl text-[#3F6B2E]">{form.quantity}</span>
          <button type="button"
            onClick={() => set('quantity', Math.min(20, form.quantity + 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-xl font-bold hover:border-[#7BA05B] transition-colors flex items-center justify-center">
            +
          </button>
          <span className="ml-2 text-sm text-gray-500">
            Tổng: <strong className="text-[#C9832E] text-base">{fmt(total)}</strong>
          </span>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Họ và tên *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Ví dụ: Nguyễn Thị Lan"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#3F6B2E] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Số điện thoại *</label>
        <input value={form.phone} onChange={e => set('phone', e.target.value)}
          placeholder="0912 345 678" type="tel"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#3F6B2E] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Email <span className="text-gray-400 font-normal">(không bắt buộc)</span></label>
        <input value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="email@gmail.com" type="email"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#3F6B2E] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Địa chỉ giao hàng chi tiết *</label>
        <textarea value={form.address} onChange={e => set('address', e.target.value)}
          placeholder="Số nhà, ngõ/hẻm, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          rows={3}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#3F6B2E] focus:outline-none transition-colors resize-none" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Ghi chú <span className="text-gray-400 font-normal">(không bắt buộc)</span></label>
        <input value={form.note} onChange={e => set('note', e.target.value)}
          placeholder="Giao giờ nào, yêu cầu đặc biệt..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#3F6B2E] focus:outline-none transition-colors" />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl py-2.5 px-4 text-center">{error}</p>
      )}

      <button type="submit" disabled={step === 'loading'}
        className="w-full py-4 rounded-2xl font-extrabold text-white text-lg bg-gradient-to-r from-[#C9832E] to-[#A0601A] hover:from-[#A0601A] hover:to-[#C9832E] transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-amber-200">
        {step === 'loading'
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Đang gửi đơn...
            </span>
          : '🛒 ĐẶT HÀNG NGAY – NHẬN QR CHUYỂN KHOẢN'}
      </button>
      <p className="text-xs text-gray-400 text-center">🔒 Thông tin bảo mật tuyệt đối · Xác nhận đơn qua chuyển khoản</p>
    </form>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SetXoiCom() {
  const orderRef = useRef<HTMLDivElement>(null)
  const scrollToOrder = () => orderRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-[#FAF7EE] font-sans">

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3A0F] via-[#3F6B2E] to-[#1E3A0F] text-white">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-14">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl px-5 py-3 shadow-xl inline-flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-bep-co-ha.png" alt="Bếp Cô Hạ"
                className="h-12 w-12 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <div>
                <p className="text-[#3F6B2E] font-extrabold text-xl leading-tight tracking-tight">Bếp Cô Hạ</p>
                <p className="text-gray-400 text-xs">Hacofood.vn</p>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span className="bg-red-500 text-white text-sm font-bold px-5 py-1.5 rounded-full animate-bounce shadow">
              🌿 Đặc Sản Hà Nội – Cốm Mễ Trì Tươi Ngon
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-6 max-w-3xl mx-auto">
            <p className="text-green-300 font-semibold text-base mb-2 italic">
              "Hà Nội mùa cốm – thơm thơm gió mới, xanh xanh lá non." – Thạch Lam
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Sét Xôi Cốm Bếp Cô Hạ<br />
              <span className="text-[#B8E08A]">Thơm Mát Lá Sen, Dẻo Ngọt Cốm Mễ Trì</span>
            </h1>
            <p className="mt-4 text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Xôi cốm truyền thống Hà Nội – tự tay Cô Hạ chọn cốm tươi Mễ Trì,<br className="hidden sm:block" />
              gói lá sen thơm mát. Quà biếu ý nghĩa, ăn là nhớ mãi.
            </p>
          </div>

          {/* Hero image */}
          <div className="flex justify-center mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 w-full max-w-sm sm:max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMG} alt="Sét Xôi Cốm Bếp Cô Hạ"
                className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '🌿', text: 'Cốm Mễ Trì tươi ngon' },
              { icon: '🍃', text: 'Gói lá sen thơm mát' },
              { icon: '🎁', text: 'Quà biếu sang trọng' },
              { icon: '🚚', text: 'Giao toàn quốc' },
            ].map(s => (
              <div key={s.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm border border-white/10">
                <span>{s.icon}</span><span className="font-medium">{s.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={scrollToOrder}
              className="bg-gradient-to-r from-[#C9832E] to-[#A0601A] hover:from-[#A0601A] hover:to-[#C9832E] text-white font-extrabold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all active:scale-95">
              Đặt Hàng Ngay →
            </button>
            <a href="#san-pham"
              className="bg-white/10 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors text-center">
              Xem Sét Xôi Cốm
            </a>
          </div>
        </div>
      </section>

      {/* ══ PAIN AGITATION ══ */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block border border-red-200 bg-red-50 text-red-600 font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-4">
            BẠN CÓ ĐANG GẶP TÌNH HUỐNG NÀY?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8">
            Tại Sao Xôi Cốm Tự Làm<br />
            <span className="text-red-500">Lúc Nhão, Lúc Khô, Vị Không Như Ý?</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: '😩', t: 'Khó tìm cốm tươi ngon', d: 'Cốm ngoài chợ không rõ nguồn gốc, cốm già cứng, cốm non nhão – làm xôi ra không đạt.' },
              { icon: '🍃', t: 'Không biết gói lá sen đúng cách', d: 'Lá sen héo, gói không chặt, xôi bị khô hay chảy nước – mất đi hương thơm đặc trưng.' },
              { icon: '⏰', t: 'Mất cả buổi sáng chuẩn bị', d: 'Ngâm gạo, hấp xôi, tìm lá sen – cả buổi loay hoay chưa chắc ra được mẻ ngon.' },
              { icon: '🎁', t: 'Quà biếu không sang, thiếu điểm nhấn', d: 'Đặt xôi ngoài hàng thì na ná, mua về tự đóng thì không đẹp. Không xứng với người nhận.' },
            ].map(item => (
              <div key={item.t} className="flex gap-4 bg-red-50 rounded-2xl p-5">
                <span className="text-3xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">{item.t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-gray-600 text-base max-w-xl mx-auto">
            Không phải lỗi của bạn. Xôi cốm ngon cần đúng nguyên liệu, đúng tay nghề, đúng thời điểm.
            <strong className="text-[#3F6B2E]"> Và giờ đây Cô Hạ đã làm sẵn cho bạn.</strong>
          </p>
        </div>
      </section>

      {/* ══ GALLERY SẢN PHẨM ══ */}
      <section id="san-pham" className="py-14 px-4 sm:px-6 bg-[#FAF7EE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block border border-[#B8E08A] bg-[#F0FBE8] text-[#3F6B2E] font-bold text-xs px-5 py-1.5 rounded-full tracking-widest mb-3">
              SẢN PHẨM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Sét Xôi Cốm Bếp Cô Hạ<br />
              <span className="text-[#C9832E]">Thơm Mát – Dẻo Ngon – Đóng Gói Sang Trọng</span>
            </h2>
          </div>

          {/* Row 1: 3 ảnh cao */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3 h-52 sm:h-72">
            {SAN_PHAM.slice(0, 3).map(item => (
              <div key={item.label} className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-md h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs sm:text-sm font-semibold drop-shadow leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Row 2: 3 ảnh vừa */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 h-44 sm:h-56">
            {SAN_PHAM.slice(3, 6).map(item => (
              <div key={item.label} className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button onClick={scrollToOrder}
              className="bg-gradient-to-r from-[#C9832E] to-[#A0601A] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95">
              Tôi Muốn Đặt Ngay →
            </button>
          </div>
        </div>
      </section>

      {/* ══ SOLUTION / MECHANISM ══ */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Ảnh sản phẩm nổi bật */}
            <div className="relative flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-xs w-full" style={{ aspectRatio: '3/4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SP + 'IMG_0197.JPG'} alt="Sét Xôi Cốm Bếp Cô Hạ"
                  className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute -top-3 -right-3 bg-[#C9832E] text-white font-extrabold text-sm px-4 py-2 rounded-full shadow-lg rotate-6">
                Tự tay<br />Cô Hạ làm
              </div>
            </div>

            {/* Copy */}
            <div>
              <span className="inline-block border border-[#B8E08A] bg-[#F0FBE8] text-[#3F6B2E] font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-4">
                TẠI SAO CHỌN BẾP CÔ HẠ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
                Gặp Cô Hạ.<br />
                <span className="text-[#C9832E]">Sét Xôi Cốm Chuẩn Vị Hà Nội</span><br />
                Tự Tay Chọn & Gói Từng Chiếc.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cô Hạ chọn cốm Mễ Trì từ làng nghề truyền thống – cốm non tươi xanh, dẻo ngọt tự nhiên.
                Xôi được hấp đúng tay, gói trong lá sen thơm mát.
                <strong className="text-gray-800"> Bạn nhận được một sét hoàn chỉnh – mở ra là thơm ngay.</strong>
              </p>

              <div className="space-y-3">
                {[
                  { icon: '🌿', t: 'Cốm Mễ Trì tươi – chọn từng mẻ', d: 'Không dùng cốm già, cốm khô hay cốm pha tạp. Chỉ cốm non xanh, dẻo, thơm vừa hái.' },
                  { icon: '🍃', t: 'Gói lá sen thật – thơm mát tự nhiên', d: 'Lá sen tươi bảo quản nhiệt, giữ hương thơm tự nhiên, tăng trải nghiệm thưởng thức.' },
                  { icon: '🎁', t: 'Đóng hộp sang trọng – xứng làm quà', d: 'Hộp đựng chắc chắn, ship toàn quốc không biến dạng. Quà biếu đẹp từ ngoài vào trong.' },
                  { icon: '⚡', t: 'Nhận hàng – mở ra – thưởng thức ngay', d: 'Không cần chuẩn bị thêm gì. Xôi cốm đã sẵn sàng, thơm ngon, dẻo mềm đúng chuẩn.' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.t}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section className="py-12 px-4 sm:px-6 bg-[#FAF7EE]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
            Dùng Được Cho Mọi Dịp
          </h2>
          <p className="text-gray-500 mb-8">Một sét xôi cốm – vạn lý do để tặng</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: '🎊', name: 'Tết Nguyên Đán', sub: 'Quà biếu ý nghĩa' },
              { icon: '💒', name: 'Cưới hỏi, đính hôn', sub: 'Ý nghĩa, sang trọng' },
              { icon: '👔', name: 'Biếu sếp, đối tác', sub: 'Lịch sự, độc đáo' },
              { icon: '🙏', name: 'Lễ chùa, cúng giỗ', sub: 'Truyền thống, trang nghiêm' },
              { icon: '🎂', name: 'Sinh nhật, tân gia', sub: 'Khác biệt, đáng nhớ' },
              { icon: '❤️', name: 'Quà cho người thân', sub: 'Ấm áp, thơm thảo' },
            ].map(item => (
              <div key={item.name} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <span className="text-4xl">{item.icon}</span>
                <p className="font-bold text-gray-800 mt-2">{item.name}</p>
                <p className="text-sm text-[#3F6B2E]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THÀNH PHẦN & HƯỚNG DẪN ══ */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Thành phần */}
            <div className="bg-[#FAF7EE] rounded-3xl p-6 border border-amber-100">
              <h3 className="font-extrabold text-xl text-[#3F6B2E] mb-4">🌿 Thành Phần Sét</h3>
              <div className="space-y-3 text-gray-600 text-sm">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🌾</span>
                  <div><p className="font-bold text-gray-800">Xôi Cốm</p><p>Gạo nếp thơm + cốm Mễ Trì tươi, hấp chín dẻo ngọt tự nhiên</p></div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🍃</span>
                  <div><p className="font-bold text-gray-800">Gói Lá Sen</p><p>Lá sen tươi thơm mát, giữ nhiệt & hương tự nhiên</p></div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🥥</span>
                  <div><p className="font-bold text-gray-800">Dừa nạo & Vừng</p><p>Rắc mặt xôi, tăng vị béo bùi truyền thống</p></div>
                </div>
              </div>
              <div className="bg-green-100 rounded-xl px-4 py-3 mt-4">
                <p className="text-[#3F6B2E] font-bold text-sm">+ Công thức bí mật của Bếp Cô Hạ</p>
                <p className="text-green-800 text-xs mt-0.5">Chỉ có 1 nơi sản xuất, không nơi nào khác</p>
              </div>
            </div>

            {/* Hướng dẫn thưởng thức */}
            <div className="bg-[#F0FBE8] rounded-3xl p-6 border border-green-100">
              <h3 className="font-extrabold text-xl text-[#3F6B2E] mb-4">📋 Cách Thưởng Thức</h3>
              <ol className="space-y-2.5 text-gray-600 text-sm">
                <li className="flex gap-2.5"><span className="bg-[#3F6B2E] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span><span>Mở gói lá sen – đã dậy mùi thơm ngay lập tức</span></li>
                <li className="flex gap-2.5"><span className="bg-[#3F6B2E] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span><span>Ăn ngay khi còn ấm – ngon nhất trong vòng <strong>30 phút</strong> sau khi mở</span></li>
                <li className="flex gap-2.5"><span className="bg-[#3F6B2E] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span><span>Nếu để nguội: hâm lại <strong>30 giây</strong> trong lò vi sóng, bọc ẩm trước khi hâm</span></li>
                <li className="flex gap-2.5"><span className="bg-[#3F6B2E] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span><span>Thưởng thức cùng chè đậu xanh hoặc nước trà xanh để trọn vị Hà Nội</span></li>
              </ol>
            </div>

            {/* Mẹo bảo quản */}
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <h3 className="font-extrabold text-xl text-blue-700 mb-4">💡 Bảo Quản</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex gap-2">🌡️ <span><strong>Ngăn mát:</strong> dùng trong <strong>1 ngày</strong></span></li>
                <li className="flex gap-2">❄️ <span><strong>Ngăn đông:</strong> dùng trong <strong>1 tuần</strong> (hâm lò vi sóng trước khi ăn)</span></li>
                <li className="flex gap-2">✅ <span>Ngon nhất khi ăn <strong>trong ngày</strong> nhận hàng</span></li>
                <li className="flex gap-2">📦 <span>Hộp đóng kín – giữ hương trong quá trình vận chuyển</span></li>
              </ul>
            </div>

            {/* Cam kết */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
              <h3 className="font-extrabold text-xl text-amber-700 mb-4">🤝 Cam Kết</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex gap-2">✅ <span>Cốm <strong>tươi ngon</strong> từ làng Mễ Trì – không bảo quản hóa chất</span></li>
                <li className="flex gap-2">🍃 <span>Lá sen <strong>thật</strong> – không dùng lá giả hay túi nhựa</span></li>
                <li className="flex gap-2">🚚 <span>Đóng gói cẩn thận – ship không biến dạng</span></li>
                <li className="flex gap-2">💯 <span>Không ngon – <strong>hoàn tiền 100%</strong></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ UY TÍN – KÊNH TRUYỀN THÔNG ══ */}
      <section className="py-14 px-4 sm:px-6 bg-[#FAF7EE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block border border-amber-300 bg-amber-50 text-amber-700 font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-3">
              THƯƠNG HIỆU UY TÍN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Bếp Cô Hạ – Triệu Người Tin Tưởng<br />
              <span className="text-[#C9832E]">Trên Khắp Các Nền Tảng</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Facebook · TikTok · YouTube · Group cộng đồng – hàng triệu lượt theo dõi, hàng nghìn đơn hàng thành công
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {UY_TIN.map(img => (
              <div key={img.label} className="rounded-2xl overflow-hidden shadow-md bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.label}
                  className="w-full h-44 object-cover object-top" />
                <p className="text-center text-xs font-semibold text-gray-600 py-2 px-2 leading-tight">{img.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#F0FBE8] rounded-3xl p-6 text-center max-w-2xl mx-auto border border-green-100">
            <p className="text-[#3F6B2E] font-bold text-lg mb-2">
              "Cô Hạ làm từ tâm – từng chiếc xôi cốm đều là tình yêu với ẩm thực Hà Nội."
            </p>
            <p className="text-green-700 text-sm italic">– Bếp Cô Hạ, Hacofood.vn</p>
          </div>
        </div>
      </section>

      {/* ══ FEEDBACK KHÁCH HÀNG ══ */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block border border-green-200 bg-[#F0FBE8] text-[#3F6B2E] font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-3">
              KHÁCH ĐÃ ĐẶT NÓI GÌ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Hàng Nghìn Khách Hài Lòng<br />
              <span className="text-[#C9832E]">Đặt Lại Nhiều Lần, Giới Thiệu Người Thân</span>
            </h2>
          </div>

          {/* Masonry 2 cột */}
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {FEEDBACKS.map((src, i) => (
              <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Feedback khách hàng ${i + 1}`}
                  className="w-full h-auto object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={scrollToOrder}
              className="bg-gradient-to-r from-[#C9832E] to-[#A0601A] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95">
              Tôi Muốn Đặt Ngay →
            </button>
          </div>
        </div>
      </section>

      {/* ══ PRICING + ORDER FORM ══ */}
      <section ref={orderRef} id="dat-hang" className="py-16 px-4 sm:px-6 bg-[#FAF7EE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block border border-[#B8E08A] bg-[#F0FBE8] text-[#3F6B2E] font-bold text-xs px-5 py-1.5 rounded-full tracking-widest mb-3">
              ĐẶT HÀNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Mang Sét Xôi Cốm Bếp Cô Hạ<br />
              <span className="text-[#C9832E]">Về Nhà Bạn Hôm Nay</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Giao tận nhà toàn quốc · Thanh toán khi nhận hàng · Đảm bảo hàng chính hãng từ Bếp Cô Hạ
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left: Giá & Cam kết */}
            <div>
              {/* Product card */}
              <div className="relative rounded-2xl p-5 border-2 border-[#3F6B2E] bg-[#F0FBE8] mb-8">
                <span className="absolute -top-3 left-4 bg-[#3F6B2E] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Sản phẩm duy nhất
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌿</span>
                    <div>
                      <p className="font-extrabold text-gray-800 text-lg">Sét Xôi Cốm Bếp Cô Hạ</p>
                      <p className="text-gray-500 text-sm">Xôi cốm + lá sen + dừa vừng · Đóng hộp sang trọng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-2xl text-[#C9832E]">{fmt(PRICE)}</p>
                    <p className="text-gray-400 text-xs">/sét</p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3">
                {[
                  { icon: '🚚', t: 'Giao hàng toàn quốc', d: 'Ship tận nhà, đóng gói chắc chắn không biến dạng' },
                  { icon: '💳', t: 'COD – Thanh toán khi nhận hàng', d: 'Nhận hàng, kiểm tra ổn mới trả tiền' },
                  { icon: '✅', t: 'Hàng chính hãng Bếp Cô Hạ', d: 'Sản xuất theo công thức độc quyền' },
                  { icon: '💯', t: 'Không ngon – hoàn tiền 100%', d: 'Cam kết chất lượng tuyệt đối' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3 items-start">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.t}</p>
                      <p className="text-gray-500 text-xs">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-lg">
              <h3 className="font-extrabold text-xl text-[#3F6B2E] mb-6 text-center">
                Điền Thông Tin Đặt Hàng
              </h3>
              <OrderForm />
            </div>
          </div>
        </div>
      </section>

      {/* ══ P.S. / URGENCY ══ */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-r from-[#1E3A0F] to-[#3F6B2E] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-green-200 text-sm font-semibold mb-2">P.S.</p>
          <p className="text-lg leading-relaxed">
            Mỗi mùa cốm qua đi rất nhanh. Cốm ngon nhất chỉ có <strong>vài tháng trong năm</strong>.
            Đừng để hết mùa mới tiếc – đặt ngay hôm nay, tận hưởng hương vị Hà Nội đích thực.
          </p>
          <button onClick={scrollToOrder}
            className="mt-6 bg-[#C9832E] hover:bg-[#A0601A] text-white font-extrabold px-10 py-4 rounded-2xl transition-colors active:scale-95 text-lg">
            Đặt Hàng Ngay →
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 text-center text-sm">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl px-4 py-2 inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-bep-co-ha.png" alt="Bếp Cô Hạ"
                className="h-9 w-9 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <div className="text-left">
                <p className="text-[#3F6B2E] font-extrabold text-base leading-tight">Bếp Cô Hạ</p>
                <p className="text-gray-400 text-xs">Hacofood.vn</p>
              </div>
            </div>
          </div>
          <p>Sét Xôi Cốm Bếp Cô Hạ – Sản xuất theo công thức độc quyền từ làng nghề Mễ Trì</p>
          <p>Mọi thắc mắc liên hệ qua: <strong className="text-gray-300">Facebook: Bếp Cô Hạ</strong> hoặc số điện thoại trên bao bì</p>
          <p className="text-gray-600 text-xs">© 2025 Hacofood.vn · Bếp Cô Hạ. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
