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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  Inventory,
  ShoppingCart,
  TrendingUp,
  Notifications,
  Logout,
  Add,
  Store,
  Assessment,
  People,
  Star,
  LocalShipping,
  Payment,
  Visibility,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { supplierAPI } from '@/utils/api';

export default function SupplierDashboard() {
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
      if (userData.role !== 'supplier') {
        router.push('/login');
        return;
      }
      setUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Fetch supplier data
  const { data: analytics } = useQuery('supplierAnalytics', supplierAPI.getAnalytics);
  const { data: products } = useQuery('supplierProducts', supplierAPI.getProducts);
  const { data: orders } = useQuery('supplierOrders', supplierAPI.getOrders);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const navigationItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/supplier/dashboard' },
    { icon: <Inventory />, text: 'Inventory', path: '/supplier/inventory' },
    { icon: <ShoppingCart />, text: 'Orders', path: '/supplier/orders' },
    { icon: <Assessment />, text: 'Analytics', path: '/supplier/analytics' },
    { icon: <People />, text: 'Customers', path: '/supplier/customers' },
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
              Supplier Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={5} color="error">
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
              bgcolor: 'secondary.main',
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
                    '&:hover': { bgcolor: 'secondary.dark' },
                    bgcolor: router.pathname === item.path ? 'secondary.dark' : 'transparent',
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
            bgcolor: 'secondary.main',
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
                  '&:hover': { bgcolor: 'secondary.dark' },
                  bgcolor: router.pathname === item.path ? 'secondary.dark' : 'transparent',
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
              Welcome back, {user.business_name || user.name}! 🏪
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your inventory and track your business performance
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
                        {analytics?.total_orders || 0}
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
                      <Payment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        ₹{analytics?.total_revenue || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
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
                      <Inventory />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {products?.products?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Products
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
                      <Star />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {user.trust_score || 0.0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Trust Score
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions & Recent Orders */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => router.push('/supplier/inventory/add')}
                      fullWidth
                    >
                      Add Product
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShoppingCart />}
                      onClick={() => router.push('/supplier/orders')}
                      fullWidth
                    >
                      View Orders
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Assessment />}
                      onClick={() => router.push('/supplier/analytics')}
                      fullWidth
                    >
                      View Analytics
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Orders
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Vendor</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders?.orders?.slice(0, 5).map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.vendor?.name}</TableCell>
                            <TableCell>₹{order.final_amount}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={
                                  order.status === 'delivered' ? 'success' :
                                  order.status === 'pending' ? 'warning' : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!orders?.orders || orders.orders.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No orders yet. Start by adding products!
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Popular Products & Performance */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Popular Products
                  </Typography>
                  {analytics?.popular_products?.slice(0, 5).map((product: any) => (
                    <Box key={product.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.total_sold} units sold
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="primary">
                          ₹{product.price}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                  {(!analytics?.popular_products || analytics.popular_products.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No sales data yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Order Completion Rate
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {analytics?.completion_rate || 0}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average Rating
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" color="warning.main">
                          {analytics?.average_rating || 0.0}
                        </Typography>
                        <Star color="warning" />
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Customers
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {analytics?.total_customers || 0}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 