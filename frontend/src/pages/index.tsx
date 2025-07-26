import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import {
  Store,
  ShoppingCart,
  Star,
  TrendingUp,
  Security,
  Support,
  Language,
  Phone,
  Email,
  Storefront as StorefrontIcon,
  LocalShipping as LocalShippingIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email as EmailOutlined,
  Phone as PhoneOutlined,
  LocationOn as LocationOnOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { commonAPI } from '@/utils/api';
import { PlatformStats } from '@/types';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch platform stats
  const { data: stats } = useQuery<{ stats: PlatformStats }>(
    'platformStats',
    commonAPI.getPlatformStats,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleRoleSelect = (role: 'vendor' | 'supplier') => {
    if (user) {
      // User is logged in, redirect to appropriate dashboard
      if (user.role === role) {
        router.push(`/${role}/dashboard`);
      } else {
        // User has different role, show message
        alert(`You are registered as a ${user.role}. Please log in with a ${role} account.`);
      }
    } else {
      // User not logged in, redirect to registration
      router.push(`/register?role=${role}`);
    }
  };

  const features = [
    {
      icon: <Store color="primary" sx={{ fontSize: 40 }} />,
      title: 'Trusted Suppliers',
      description: 'Connect with verified suppliers with transparent ratings and reviews',
    },
    {
      icon: <ShoppingCart color="primary" sx={{ fontSize: 40 }} />,
      title: 'Easy Ordering',
      description: 'Simple order placement with real-time tracking and notifications',
    },
    {
      icon: <Star color="primary" sx={{ fontSize: 40 }} />,
      title: 'Quality Assurance',
      description: 'FSSAI certified products with quality grading and organic options',
    },
    {
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: 'Safe payment processing with dispute resolution system',
    },
    {
      icon: <Support color="primary" sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in Hindi and English',
    },
    {
      icon: <TrendingUp color="primary" sx={{ fontSize: 40 }} />,
      title: 'Analytics & Insights',
      description: 'Detailed analytics for suppliers to optimize their business',
    },
  ];

  const statsData = [
    {
      label: 'Active Vendors',
      value: stats?.stats?.users?.total_vendors || 0,
      color: 'primary',
    },
    {
      label: 'Trusted Suppliers',
      value: stats?.stats?.users?.total_suppliers || 0,
      color: 'secondary',
    },
    {
      label: 'Products Listed',
      value: stats?.stats?.products?.total_products || 0,
      color: 'success',
    },
    {
      label: 'Orders Completed',
      value: stats?.stats?.orders?.completed_orders || 0,
      color: 'info',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '70%',
            height: '70%',
            backgroundImage: 'radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Typography
                  variant={isMobile ? 'h2' : 'h1'}
                  component="h1"
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '0.1em',
                      left: 0,
                      width: '100%',
                      height: '0.1em',
                      backgroundColor: theme.palette.secondary.main,
                      zIndex: -1,
                    }
                  }}
                >
                  SahiSauda
                </Typography>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #ffffff, #f0f0f0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Empowering Indian Street Food Vendors
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.2rem', lineHeight: 1.6 }}>
                  Connect with trusted suppliers for quality raw materials. 
                  Streamline your business with our comprehensive marketplace platform.
                </Typography>
                
                <Stack direction={isMobile ? 'column' : 'row'} spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleRoleSelect('vendor')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: '50px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    I'm a Vendor
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleRoleSelect('supplier')}
                    sx={{
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: '50px',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    I'm a Supplier
                  </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(20px)',
                    zIndex: 1,
                  }}
                />
                <Card
                  sx={{
                    maxWidth: 450,
                    width: '100%',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    position: 'relative',
                    zIndex: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      zIndex: 0,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 5, position: 'relative', zIndex: 1 }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 3,
                        textShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      }}
                    >
                      Platform Statistics
                    </Typography>
                    <Grid container spacing={3}>
                      {statsData.map((stat, index) => (
                        <Grid item xs={6} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.05)',
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                background: 'rgba(255,255,255,0.1)',
                              },
                            }}
                          >
                            <Typography 
                              variant="h3" 
                              color="white" 
                              sx={{ 
                                fontWeight: 700,
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)',
                              }}
                            >
                              {stat.value.toLocaleString()}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                opacity: 0.9,
                                fontWeight: 500,
                                mt: 1,
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '2px',
                }
              }}
            >
              Why Choose SahiSauda?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mt: 4,
                mb: 2,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Built specifically for Indian street food vendors and suppliers
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3,
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      '& svg': {
                        fontSize: 40,
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box 
        sx={{ 
          py: 12,
          background: `linear-gradient(180deg, #ffffff 0%, ${theme.palette.primary.light}15 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 50%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: 0,
            width: '50%',
            height: '50%',
            backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 50%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              How It Works
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mt: 2,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              A simple process designed for both vendors and suppliers
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            {/* Connecting line */}
            {!isMobile && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '120px',
                  left: '50%',
                  width: '75%',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`,
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                  zIndex: 1,
                }}
              />
            )}
            
            <Grid container spacing={5} sx={{ mt: 4, position: 'relative', zIndex: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      fontSize: 28,
                      fontWeight: 'bold',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    }}
                  >
                    1
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    For Vendors
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Browse suppliers, compare prices, read reviews, and place orders with ease. 
                    Track deliveries and manage your inventory efficiently.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      fontSize: 28,
                      fontWeight: 'bold',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    }}
                  >
                    2
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    For Suppliers
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    List your products, set competitive prices, manage orders, and grow your business 
                    with detailed analytics and customer insights.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'success.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      fontSize: 28,
                      fontWeight: 'bold',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    }}
                  >
                    3
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Trust & Quality
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Build trust through transparent ratings, verified reviews, and our dispute 
                    resolution system. Quality assurance for all transactions.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          position: 'relative',
          py: { xs: 10, md: 16 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px',
            opacity: 0.2,
            zIndex: 2,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, color: 'white' }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                mb: 3,
              }}
            >
              Ready to Get Started?
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6, 
                fontWeight: 400,
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Join thousands of vendors and suppliers already using SahiSauda
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center', 
                gap: 3,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => handleRoleSelect('vendor')}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                  }
                }}
                startIcon={<ShoppingCart />}
              >
                Start as Vendor
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleRoleSelect('supplier')}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  borderColor: 'white', 
                  color: 'white',
                  borderWidth: 2,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                  }
                }}
                startIcon={<Store />}
              >
                Start as Supplier
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          bgcolor: 'grey.900', 
          color: 'white', 
          pt: 10,
          pb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <StorefrontIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  SahiSauda Market
                </Typography>
                <Typography variant="body1" color="grey.400" sx={{ lineHeight: 1.7, mb: 3 }}>
                  Connecting street food vendors with quality suppliers across India.
                  Building a stronger ecosystem for local businesses.
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <IconButton 
                    color="inherit" 
                    aria-label="Facebook"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="Twitter"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="Instagram"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton 
                    color="inherit" 
                    aria-label="LinkedIn"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 2,
                    bgcolor: theme.palette.primary.main,
                  }
                }}
              >
                Contact Us
              </Typography>
              
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EmailOutlined fontSize="small" sx={{ color: 'grey.400' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary="support@sahisauda.com"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'grey.400', sx: { mt: 0.5 } }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneOutlined fontSize="small" sx={{ color: 'grey.400' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone"
                    secondary="+91 98765 43210"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'grey.400', sx: { mt: 0.5 } }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationOnOutlined fontSize="small" sx={{ color: 'grey.400' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address"
                    secondary="123 Market Street, Mumbai, India"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'grey.400', sx: { mt: 0.5 } }}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 2,
                    bgcolor: theme.palette.primary.main,
                  }
                }}
              >
                Language
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Chip 
                  icon={<Language />} 
                  label="हिंदी" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                />
                <Chip 
                  icon={<Language />} 
                  label="English" 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                />
              </Stack>
              
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 40,
                      height: 2,
                      bgcolor: theme.palette.primary.main,
                    }
                  }}
                >
                  Quick Links
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="hover"
                      sx={{ 
                        display: 'block', 
                        color: 'grey.400', 
                        py: 0.5,
                        '&:hover': { color: 'white' },
                      }}
                    >
                      About Us
                    </Link>
                  </Grid>
                  <Grid item xs={6}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="hover"
                      sx={{ 
                        display: 'block', 
                        color: 'grey.400', 
                        py: 0.5,
                        '&:hover': { color: 'white' },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Grid>
                  <Grid item xs={6}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="hover"
                      sx={{ 
                        display: 'block', 
                        color: 'grey.400', 
                        py: 0.5,
                        '&:hover': { color: 'white' },
                      }}
                    >
                      Terms of Service
                    </Link>
                  </Grid>
                  <Grid item xs={6}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="hover"
                      sx={{ 
                        display: 'block', 
                        color: 'grey.400', 
                        py: 0.5,
                        '&:hover': { color: 'white' },
                      }}
                    >
                      Help Center
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          
          <Box 
            sx={{ 
              mt: 8, 
              pt: 3, 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="grey.400">
              © 2024 SahiSauda. All rights reserved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  color: 'grey.400', 
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                }}
              >
                Privacy
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  color: 'grey.400', 
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                }}
              >
                Terms
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  color: 'grey.400', 
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                }}
              >
                Sitemap
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}