import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('dark')==='true')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="min-h-screen" style={{ background: "var(--bg)" }}>{children}</body>
    </html>
  )
}
