import { Box, Container, Typography } from '@mui/material'

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          {'wpm'} says hello world!
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Routing, SEO, auth, analytics and theming are already wired — start building in src/pages.
        </Typography>
      </Box>
    </Container>
  )
}
