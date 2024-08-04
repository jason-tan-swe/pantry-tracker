import { signIn } from "@/utils/auth"
import { Button, Container, Typography, Paper } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'

export default function Login() {

  return (
    <Container maxWidth="sm">
      <form action={
        async () => {
          "use server"
          await signIn('google')
        }
      }>
      <Paper
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Choose your preferred login method
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{ mt: 3, mb: 2 }}
          type="submit"
        >
          Continue with Google
        </Button>
      </Paper>
      </form>
    </Container>
  )
}