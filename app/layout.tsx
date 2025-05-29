import './globals.css'
import React from 'react'; 

export const metadata = {
  title: 'Chat App',
  description: 'Real-time chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
