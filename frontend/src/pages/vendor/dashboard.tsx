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
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { vendorAPI } from '@/utils/api';

export default function VendorDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Fetch vendor data
  const { data: orders } = useQuery('vendorOrders', vendorAPI.getOrders);
  const { data: stats } = useQuery('vendorStats', () => 
    vendorAPI.getSuppliers().then(() => ({ totalSuppliers: 0, recentOrders: 0 }))
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const navigationItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/vendor/dashboard' },
    { icon: <Store />, text: 'Browse Suppliers', path: '/vendor/suppliers' },
    { icon: <ShoppingCart />, text: 'My Orders', path: '/vendor/orders' },
    { icon: <RateReview />, text: 'Reviews', path: '/vendor/reviews' },
    { icon: <Support />, text: 'Support', path: '/vendor/support' },
  ];

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
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Vendor Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              bgcolor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ color: 'white' }}>
              SahiSauda
            </Typography>
          </Toolbar>
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {navigationItems.map((item) => (
                <ListItem
                  key={item.text}
                  button
                  onClick={() => router.push(item.path)}
                  sx={{
                    '&:hover': { bgcolor: 'primary.dark' },
                    bgcolor: router.pathname === item.path ? 'primary.dark' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ bgcolor: 'white', my: 2 }} />
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'white' }}>
            SahiSauda
          </Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.text}
                button
                onClick={() => {
                  router.push(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  '&:hover': { bgcolor: 'primary.dark' },
                  bgcolor: router.pathname === item.path ? 'primary.dark' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ bgcolor: 'white', my: 2 }} />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          mt: isMobile ? 8 : 0,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your orders and discover trusted suppliers
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ShoppingCart />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {orders?.orders?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <LocalShipping />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {orders?.orders?.filter((o: any) => o.status === 'delivered').length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivered
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Payment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        ₹{orders?.orders?.reduce((sum: number, o: any) => sum + (o.final_amount || 0), 0) || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Store />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {stats?.totalSuppliers || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Suppliers
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<Store />}
                      onClick={() => router.push('/vendor/suppliers')}
                      fullWidth
                    >
                      Browse Suppliers
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => router.push('/vendor/orders/new')}
                      fullWidth
                    >
                      Place New Order
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Search />}
                      onClick={() => router.push('/vendor/products')}
                      fullWidth
                    >
                      Search Products
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Orders
                  </Typography>
                  {orders?.orders?.slice(0, 3).map((order: any) => (
                    <Box key={order.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            Order #{order.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={order.status}
                          color={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'pending' ? 'warning' : 'default'
                          }
                          size="small"
                        />
                      </Stack>
                    </Box>
                  ))}
                  {(!orders?.orders || orders.orders.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No orders yet. Start by browsing suppliers!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Trust Score */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Trust Score
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Star sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" color="primary.main">
                    {user.trust_score || 0.0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on {user.total_orders || 0} orders and {user.successful_orders || 0} successful deliveries
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
} 