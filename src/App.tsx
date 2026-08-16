import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { Box } from '@mui/material'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { PageLoader } from '@components/PageLoader'
import { useScrollToTop } from '@hooks/useScrollToTop'

const HomePage = lazy(() => import('@pages/HomePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))

function App() {
  useScrollToTop()

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Box>
    </ErrorBoundary>
  )
}

export default App
