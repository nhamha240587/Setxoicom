import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa Bếp Cô Hạ – Mua Về Làm Là Thành Công',
  description: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa Bếp Cô Hạ – 8 nguyên liệu chọn sẵn, kèm công thức bí quyết. Làm theo là thành công. Giao tận nhà toàn quốc.',
  openGraph: {
    title: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa – Bếp Cô Hạ',
    description: 'Nguyên liệu chọn sẵn đủ bộ, kèm công thức bí quyết. Mua về làm là thành công ngay lần đầu.',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
