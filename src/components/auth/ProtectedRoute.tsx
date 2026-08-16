import { Navigate } from 'react-router'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '@pixygon/auth'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requireAuth?: boolean
  requiredRoles?: string[]
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requireAuth = true,
  requiredRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = (user as { roles?: string[] })?.roles ?? []
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))
    if (!hasRequiredRole) {
      return <Navigate to={redirectTo} replace />
    }
  }

  return <>{children}</>
}
