import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  LocationOn,
  Business,
  Store,
  ShoppingCart,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { authAPI } from '@/utils/api';
import { RegisterForm } from '@/types';

const steps = ['Account Type', 'Personal Info', 'Business Details', 'Location'];

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterForm>();

  const selectedRole = watch('role');

  // Set role from URL query parameter
  useEffect(() => {
    const { role } = router.query;
    if (role && (role === 'vendor' || role === 'supplier')) {
      setValue('role', role as 'vendor' | 'supplier');
    }
  }, [router.query, setValue]);

  const registerMutation = useMutation(authAPI.register, {
    onSuccess: (data) => {
      // Store token and user data
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Registration successful! Welcome to SahiSauda!');
      
      // Redirect based on user role
      if (data.user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/supplier/dashboard');
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: RegisterForm) => {
    setError('');
    registerMutation.mutate(data);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRoleSelect = (role: 'vendor' | 'supplier') => {
    setValue('role', role);
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Choose Your Account Type
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Select the type of account that best describes your business
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedRole === 'vendor' ? 2 : 1,
                    borderColor: selectedRole === 'vendor' ? 'primary.main' : 'grey.300',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleRoleSelect('vendor')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <ShoppingCart sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      I'm a Vendor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Street food vendor looking to source quality raw materials from trusted suppliers
                    </Typography>
                    <Chip
                      label="Street Food Vendors"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedRole === 'supplier' ? 2 : 1,
                    borderColor: selectedRole === 'supplier' ? 'primary.main' : 'grey.300',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleRoleSelect('supplier')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Store sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      I'm a Supplier
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supplier of raw materials looking to reach street food vendors across India
                    </Typography>
                    <Chip
                      label="Raw Material Suppliers"
                      color="secondary"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about yourself
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

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
                label="Phone Number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Please enter a valid 10-digit Indian phone number',
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
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
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Business Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about your business
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Business Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('business_name', {
                  required: 'Business name is required',
                })}
                error={!!errors.business_name}
                helperText={errors.business_name?.message}
              />

              <TextField
                fullWidth
                label="Business Type"
                placeholder={selectedRole === 'vendor' ? 'e.g., Street Food Vendor, Chaat Corner' : 'e.g., Wholesale Supplier, Distributor'}
                {...register('business_type')}
                error={!!errors.business_type}
                helperText={errors.business_type?.message}
              />

              {selectedRole === 'supplier' && (
                <TextField
                  fullWidth
                  label="GST Number (Optional)"
                  placeholder="e.g., 27AABCS1234Z1Z5"
                  {...register('gst_number')}
                  error={!!errors.gst_number}
                  helperText={errors.gst_number?.message}
                />
              )}
            </Stack>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Location Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Where is your business located?
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="City"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('city', {
                  required: 'City is required',
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />

              <TextField
                fullWidth
                label="State"
                {...register('state', {
                  required: 'State is required',
                })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />

              <TextField
                fullWidth
                label="Complete Address"
                multiline
                rows={3}
                {...register('address', {
                  required: 'Address is required',
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />

              <TextField
                fullWidth
                label="Pincode"
                {...register('pincode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Please enter a valid 6-digit pincode',
                  },
                })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
              />
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Join SahiSauda
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and start your journey
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ px: 4, pt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Error Alert */}
          {error && (
            <Box sx={{ px: 4, pt: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Form Content */}
          <Box sx={{ px: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          {activeStep > 0 && activeStep < steps.length - 1 && (
            <Box sx={{ px: 4, pb: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          )}

          {/* Final Submit */}
          {activeStep === steps.length - 1 && (
            <Box sx={{ px: 4, pb: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Button onClick={handleBack}>Back</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || registerMutation.isLoading}
                  >
                    {isSubmitting || registerMutation.isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Stack>
              </form>
            </Box>
          )}

          {/* Links */}
          <Box sx={{ p: 4, textAlign: 'center', borderTop: 1, borderColor: 'grey.200' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                href="/login"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in here
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