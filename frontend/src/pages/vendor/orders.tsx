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
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  MoreVert,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { vendorAPI } from '@/utils/api';
import { format } from 'date-fns';

export default function VendorOrders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Fetch orders data
  const { data: orders, isLoading } = useQuery('vendorOrders', vendorAPI.getOrders);

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

  // Mock orders data for UI development
  const mockOrders = [
    {
      id: 'ORD-001',
      date: new Date(2023, 9, 15),
      supplier: 'Organic Farms Ltd',
      items: [
        { name: 'Fresh Tomatoes', quantity: 20, unit: 'kg', price: 80 },
        { name: 'Potatoes', quantity: 50, unit: 'kg', price: 40 },
      ],
      total: 3800,
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-002',
      date: new Date(2023, 9, 18),
      supplier: 'Fresh Dairy Products',
      items: [
        { name: 'Milk', quantity: 100, unit: 'liter', price: 60 },
        { name: 'Cheese', quantity: 10, unit: 'kg', price: 400 },
      ],
      total: 10000,
      status: 'processing',
      paymentStatus: 'pending',
    },
    {
      id: 'ORD-003',
      date: new Date(2023, 9, 20),
      supplier: 'Spice World Exports',
      items: [
        { name: 'Turmeric Powder', quantity: 5, unit: 'kg', price: 300 },
        { name: 'Red Chilli Powder', quantity: 5, unit: 'kg', price: 350 },
        { name: 'Garam Masala', quantity: 2, unit: 'kg', price: 500 },
      ],
      total: 4250,
      status: 'shipped',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-004',
      date: new Date(2023, 9, 22),
      supplier: 'Grain Harvest Co.',
      items: [
        { name: 'Wheat Flour', quantity: 100, unit: 'kg', price: 40 },
        { name: 'Rice', quantity: 50, unit: 'kg', price: 60 },
      ],
      total: 7000,
      status: 'cancelled',
      paymentStatus: 'refunded',
    },
  ];

  const displayOrders = orders?.data || mockOrders;

  // Filter orders based on search term and status filter
  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status chip color mapping
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'delivered':
        return { color: 'success', icon: <CheckCircle fontSize="small" /> };
      case 'processing':
        return { color: 'info', icon: <Schedule fontSize="small" /> };
      case 'shipped':
        return { color: 'primary', icon: <LocalShipping fontSize="small" /> };
      case 'cancelled':
        return { color: 'error', icon: <Cancel fontSize="small" /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  // Payment status chip color mapping
  const getPaymentStatusChipProps = (status) => {
    switch (status) {
      case 'paid':
        return { color: 'success' };
      case 'pending':
        return { color: 'warning' };
      case 'refunded':
        return { color: 'info' };
      default:
        return { color: 'default' };
    }
  };

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
              SahiSauda - Orders
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
              My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Track and manage your purchase orders from suppliers.
            </Typography>
          </Box>

          {/* Search and filter */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search by order ID or supplier..."
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
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-filter-label">Order Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Order Status"
                  >
                    <MenuItem value="all">All Orders</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.5 }}
                  onClick={() => router.push('/vendor/orders/new')}
                >
                  New Order
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Orders table */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total (₹)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusProps = getStatusChipProps(order.status);
                    const paymentStatusProps = getPaymentStatusChipProps(order.paymentStatus);
                    
                    return (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {format(order.date, 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">₹{order.total.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            color={statusProps.color}
                            icon={statusProps.icon}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            color={paymentStatusProps.color}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/vendor/orders/${order.id}`)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <IconButton size="small" color="error">
                                <Cancel fontSize="small" />
                              </IconButton>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredOrders.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found matching your filters.
                  </Typography>
                </Box>
              )}
            </TableContainer>
          )}
        </Container>
      </Box>
    </Box>
  );
}