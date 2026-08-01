import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('dark')==='true')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
