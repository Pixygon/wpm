import { keyframes } from '@mui/material'

// Standard animation keyframes - use across all components
export const animations = {
  fadeInUp: keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `,
  slideIn: keyframes`
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  `,
  pulse: keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  `,
  shimmer: keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `,
  float: keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  `,
}

// Timing constants
export const ANIMATION_DURATION = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
  float: '3s',
  shimmer: '2s',
  pulse: '2s',
}
