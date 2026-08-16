import { createTheme } from '@mui/material/styles'

// Design tokens — shared access to values outside MUI components.
// Customize these for each project's brand.
export const tokens = {
  colors: {
    primary: '#00ccff',
    secondary: '#ff6600',
    background: {
      default: '#0a0a0f',
      paper: '#12121a',
      overlay: 'rgba(0, 0, 0, 0.7)',
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#fefefe',
      secondary: 'rgba(204, 204, 204, 0.7)',
    },
  },
  gradients: {
    dark: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accent: 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)',
    hero: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
  },
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    cardHover: '0 20px 40px rgba(0, 0, 0, 0.4)',
    button: '0 5px 15px rgba(0, 0, 0, 0.3)',
    glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: '50%',
  },
}

// MUI module augmentation example — uncomment and extend for custom palette entries:
// declare module '@mui/material/styles' {
//   interface Palette {
//     accent: Palette['primary']
//   }
//   interface PaletteOptions {
//     accent?: PaletteOptions['primary']
//   }
// }

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.colors.primary,
    },
    secondary: {
      main: tokens.colors.secondary,
    },
    background: {
      default: tokens.colors.background.default,
      paper: tokens.colors.background.paper,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: tokens.borderRadius.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
