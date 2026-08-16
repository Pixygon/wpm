import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { store, persistor } from '@store/store'
import { theme } from '@/theme'
import { installSafeLocalStorage } from '@utils/safeLocalStorage'
import { AnalyticsProvider } from '@/providers/AnalyticsProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import App from '@/App'

// Protect against QuotaExceededError on devices with full storage
installSafeLocalStorage()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <AnalyticsProvider>
            <AuthProvider>
              <BrowserRouter>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </ThemeProvider>
              </BrowserRouter>
            </AuthProvider>
          </AnalyticsProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
