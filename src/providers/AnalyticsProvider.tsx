import {
  AnalyticsProvider as PixygonAnalyticsProvider,
  AnalyticsErrorBoundary,
} from '@pixygon/analytics/react'
import type { ReactNode } from 'react'

const ANALYTICS_CONFIG = {
  projectId: '6a81b289ef5fdd05a59d73b2',
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <AnalyticsErrorBoundary>
      <PixygonAnalyticsProvider config={ANALYTICS_CONFIG}>
        {children}
      </PixygonAnalyticsProvider>
    </AnalyticsErrorBoundary>
  )
}
