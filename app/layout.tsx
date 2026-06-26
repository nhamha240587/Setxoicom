import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sét Xôi Cốm Bếp Cô Hạ – Đặc Sản Hà Nội Giao Tận Nhà',
  description: 'Sét Xôi Cốm Bếp Cô Hạ – xôi cốm Mễ Trì truyền thống, gói lá sen thơm mát. Quà biếu sang trọng, giao tận nhà toàn quốc.',
  openGraph: {
    title: 'Sét Xôi Cốm Bếp Cô Hạ',
    description: 'Xôi cốm Mễ Trì truyền thống, gói lá sen thơm mát. Giao tận nhà toàn quốc.',
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
