import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Store,
  ShoppingCart,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { authAPI } from '@/utils/api';
import { LoginForm } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const loginMutation = useMutation(authAPI.login, {
    onSuccess: (data) => {
      // Store token and user data
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      if (data.user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/supplier/dashboard');
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  const handleDemoLogin = (role: 'vendor' | 'supplier') => {
    const demoCredentials = {
      vendor: { email: 'vendor1@test.com', password: 'password123' },
      supplier: { email: 'supplier1@test.com', password: 'password123' },
    };
    
    loginMutation.mutate(demoCredentials[role]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your SahiSauda account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || loginMutation.isLoading}
                sx={{ py: 1.5 }}
              >
                {isSubmitting || loginMutation.isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          {/* Demo Login Buttons */}
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or try demo accounts
              </Typography>
            </Divider>
            
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={() => handleDemoLogin('vendor')}
                disabled={loginMutation.isLoading}
              >
                Demo Vendor
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Store />}
                onClick={() => handleDemoLogin('supplier')}
                disabled={loginMutation.isLoading}
              >
                Demo Supplier
              </Button>
            </Stack>
          </Box>

          {/* Links */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up here
              </Link>
            </Typography>
            
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link
                href="/"
                sx={{
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                ← Back to Home
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}