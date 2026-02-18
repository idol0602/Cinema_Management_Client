import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Header } from '@/components/commons/header';
import { Footer } from '@/components/commons/footer';
import { Toaster } from 'sonner';
import { ChatPopup } from '@/components/commons/ChatPopup';
import { OnlineTracker } from '@/components/commons/OnlineTracker';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Meta Cinema - Trải nghiệm điện ảnh đẳng cấp',
    template: '%s | Meta Cinema',
  },
  description: 'Hệ thống rạp chiếu phim hiện đại với công nghệ tiên tiến và dịch vụ tận tâm',
  keywords: ['Meta Cinema', 'Rạp chiếu phim', 'Phim mới', 'Đặt vé online', 'Cinema'],
  authors: [{ name: 'Meta Cinema' }],
  creator: 'Meta Cinema',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://metacinema.vn',
    title: 'Meta Cinema - Trải nghiệm điện ảnh đẳng cấp',
    description: 'Hệ thống rạp chiếu phim hiện đại với công nghệ tiên tiến và dịch vụ tận tâm',
    siteName: 'Meta Cinema',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Cinema',
    description: 'Hệ thống rạp chiếu phim hiện đại với công nghệ tiên tiến và dịch vụ tận tâm',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Header />
            {children}
            <Footer />
            <ChatPopup />
            <OnlineTracker />
            <Toaster position="top-right" richColors closeButton/>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
