import { AuthProvider as PixygonAuthProvider, useAuth, useUser } from '@pixygon/auth'
import type { ReactNode } from 'react'

const AUTH_CONFIG = {
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://api.pixygon.com/v1',
  appId: '6a81b289ef5fdd05a59d73b2',
  appName: 'wpm',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <PixygonAuthProvider config={AUTH_CONFIG}>
      {children}
    </PixygonAuthProvider>
  )
}

export { useAuth, useUser }
