import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { fetchUser } from '../api'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Voter',
  description: 'Your average voting app',
}

export default async function RootLayout({ children }) {
  const user = await fetchUser(cookies().get('token')?.value) ?? null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="Nav">
          <Link className="NavLink" href="/">
            Voter
          </Link>
          {user ? (
            <div className="NavLink">
              {user.username}#{user.discriminator}
            </div>
          ) : (
            <Link className="NavLink" href="/api/auth">
              Authenticate
            </Link>
          )
          }
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
