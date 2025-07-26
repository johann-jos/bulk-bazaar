import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  LinearProgress,
  TextField,
  InputAdornment,
  Paper,
  Rating,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  ShoppingCart,
  Store,
  Star,
  TrendingUp,
  Notifications,
  AccountCircle,
  Logout,
  Add,
  Search,
  FilterList,
  LocalShipping,
  Payment,
  RateReview,
  Support,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { vendorAPI } from '@/utils/api';

export default function VendorSuppliers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'vendor') {
        router.push('/login');
        return;
      }
      setUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Fetch suppliers data
  const { data: suppliers, isLoading } = useQuery('vendorSuppliers', vendorAPI.getSuppliers);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const navigationItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/vendor/dashboard' },
    { icon: <Store />, text: 'Browse Suppliers', path: '/vendor/suppliers' },
    { icon: <ShoppingCart />, text: 'My Orders', path: '/vendor/orders' },
    { icon: <RateReview />, text: 'Reviews', path: '/vendor/reviews' },
    { icon: <Support />, text: 'Support', path: '/vendor/support' },
  ];

  // Mock suppliers data for UI development
  const mockSuppliers = [
    {
      id: 1,
      name: 'Organic Farms Ltd',
      image: '/suppliers/supplier1.jpg',
      rating: 4.5,
      location: 'Mumbai, Maharashtra',
      categories: ['Vegetables', 'Fruits'],
      description: 'Specializing in organic produce with sustainable farming practices.',
      contactPhone: '+91 9876543210',
      contactEmail: 'info@organicfarms.com',
    },
    {
      id: 2,
      name: 'Fresh Dairy Products',
      image: '/suppliers/supplier2.jpg',
      rating: 4.2,
      location: 'Pune, Maharashtra',
      categories: ['Dairy', 'Organic'],
      description: 'Premium dairy products from ethically raised cattle.',
      contactPhone: '+91 9876543211',
      contactEmail: 'contact@freshdairy.com',
    },
    {
      id: 3,
      name: 'Spice World Exports',
      image: '/suppliers/supplier3.jpg',
      rating: 4.7,
      location: 'Kochi, Kerala',
      categories: ['Spices', 'Condiments'],
      description: 'Authentic Indian spices sourced directly from farms.',
      contactPhone: '+91 9876543212',
      contactEmail: 'sales@spiceworld.com',
    },
    {
      id: 4,
      name: 'Grain Harvest Co.',
      image: '/suppliers/supplier4.jpg',
      rating: 4.0,
      location: 'Chandigarh, Punjab',
      categories: ['Grains', 'Pulses'],
      description: 'High-quality grains and pulses from the heartland of India.',
      contactPhone: '+91 9876543213',
      contactEmail: 'info@grainharvest.com',
    },
  ];

  const displaySuppliers = suppliers?.data || mockSuppliers;

  if (!user) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              SahiSauda - Suppliers
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for navigation */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: theme.palette.primary.main,
            color: 'white',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: [1],
            py: 2,
            bgcolor: theme.palette.primary.dark,
          }}
        >
          <Typography variant="h6" noWrap component="div">
            SahiSauda Market
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => router.push(item.path)}
                sx={{
                  bgcolor:
                    router.pathname === item.path
                      ? 'rgba(255,255,255,0.2)'
                      : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  borderRadius: 1,
                  mx: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2">{user?.name || 'User'}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Vendor Account
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: isMobile ? 8 : 0,
        }}
      >
        <Container maxWidth="lg">
          {/* Page header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Browse Suppliers
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Find and connect with trusted suppliers for your business needs.
            </Typography>
          </Box>

          {/* Search and filter */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search suppliers by name, location, or products..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    sx={{ borderRadius: 2 }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    sx={{ borderRadius: 2 }}
                  >
                    Search
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Suppliers list */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <Grid container spacing={3}>
              {displaySuppliers.map((supplier) => (
                <Grid item xs={12} sm={6} md={4} key={supplier.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Store sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {supplier.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={supplier.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {supplier.rating}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn
                          fontSize="small"
                          sx={{ color: 'text.secondary', mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {supplier.location}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {supplier.categories.map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                          />
                        ))}
                      </Stack>
                      <Typography variant="body2" paragraph>
                        {supplier.description}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2">{supplier.contactPhone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2">{supplier.contactEmail}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => router.push(`/vendor/suppliers/${supplier.id}`)}
                        sx={{ borderRadius: 2 }}
                      >
                        View Products
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}