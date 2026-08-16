import { Box, Button, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Page not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    </Container>
  )
}
