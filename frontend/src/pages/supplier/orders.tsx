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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  Inventory,
  ShoppingCart,
  Analytics,
  People,
  Notifications,
  Logout,
  Search,
  FilterList,
  LocalShipping,
  CheckCircle,
  Cancel,
  Visibility,
  ExpandMore,
  ExpandLess,
  Receipt,
  Phone,
  LocationOn,
  AccessTime,
  ArrowForward,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supplierAPI } from '@/utils/api';

export default function SupplierOrders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

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

  // Fetch orders data
  const { data: orders, isLoading } = useQuery('supplierOrders', supplierAPI.getOrders);

  const queryClient = useQueryClient();

  // Update order status mutation
  const updateOrderStatusMutation = useMutation(supplierAPI.updateOrderStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('supplierOrders');
      setStatusUpdateMessage({ type: 'success', message: 'Order status updated successfully' });
      setTimeout(() => setStatusUpdateMessage(null), 5000);
      handleCloseUpdateStatusDialog();
    },
    onError: (error) => {
      setStatusUpdateMessage({ type: 'error', message: 'Failed to update order status' });
      setTimeout(() => setStatusUpdateMessage(null), 5000);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const navigationItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/supplier/dashboard' },
    { icon: <Inventory />, text: 'Inventory', path: '/supplier/inventory' },
    { icon: <ShoppingCart />, text: 'Orders', path: '/supplier/orders' },
    { icon: <Analytics />, text: 'Analytics', path: '/supplier/analytics' },
    { icon: <People />, text: 'Customers', path: '/supplier/customers' },
  ];

  // Mock orders data for UI development
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerAddress: '123, Green Park, New Delhi',
      orderDate: new Date(2023, 9, 15),
      deliveryDate: new Date(2023, 9, 18),
      status: 'Processing',
      totalAmount: 1250,
      paymentMethod: 'Online Payment',
      paymentStatus: 'Paid',
      items: [
        { id: 1, name: 'Organic Tomatoes', quantity: 5, unit: 'kg', price: 80, total: 400 },
        { id: 2, name: 'Fresh Milk', quantity: 3, unit: 'liter', price: 60, total: 180 },
        { id: 3, name: 'Basmati Rice', quantity: 5, unit: 'kg', price: 120, total: 600 },
        { id: 4, name: 'Turmeric Powder', quantity: 0.25, unit: 'kg', price: 280, total: 70 },
      ],
    },
    {
      id: 'ORD-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerAddress: '456, Sector 18, Noida',
      orderDate: new Date(2023, 9, 14),
      deliveryDate: new Date(2023, 9, 16),
      status: 'Shipped',
      totalAmount: 850,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      items: [
        { id: 1, name: 'Whole Wheat Bread', quantity: 2, unit: 'loaf', price: 40, total: 80 },
        { id: 2, name: 'Fresh Milk', quantity: 2, unit: 'liter', price: 60, total: 120 },
        { id: 3, name: 'Organic Tomatoes', quantity: 2, unit: 'kg', price: 80, total: 160 },
        { id: 4, name: 'Basmati Rice', quantity: 4, unit: 'kg', price: 120, total: 480 },
      ],
    },
    {
      id: 'ORD-003',
      customerName: 'Amit Singh',
      customerPhone: '+91 76543 21098',
      customerAddress: '789, MG Road, Bangalore',
      orderDate: new Date(2023, 9, 12),
      deliveryDate: new Date(2023, 9, 15),
      status: 'Delivered',
      totalAmount: 1560,
      paymentMethod: 'Online Payment',
      paymentStatus: 'Paid',
      items: [
        { id: 1, name: 'Basmati Rice', quantity: 10, unit: 'kg', price: 120, total: 1200 },
        { id: 2, name: 'Turmeric Powder', quantity: 1, unit: 'kg', price: 280, total: 280 },
        { id: 3, name: 'Whole Wheat Bread', quantity: 2, unit: 'loaf', price: 40, total: 80 },
      ],
    },
    {
      id: 'ORD-004',
      customerName: 'Sunita Patel',
      customerPhone: '+91 65432 10987',
      customerAddress: '101, Civil Lines, Jaipur',
      orderDate: new Date(2023, 9, 10),
      deliveryDate: new Date(2023, 9, 13),
      status: 'Cancelled',
      totalAmount: 720,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Not Applicable',
      items: [
        { id: 1, name: 'Organic Tomatoes', quantity: 3, unit: 'kg', price: 80, total: 240 },
        { id: 2, name: 'Fresh Milk', quantity: 5, unit: 'liter', price: 60, total: 300 },
        { id: 3, name: 'Whole Wheat Bread', quantity: 4, unit: 'loaf', price: 40, total: 160 },
        { id: 4, name: 'Turmeric Powder', quantity: 0.1, unit: 'kg', price: 200, total: 20 },
      ],
    },
    {
      id: 'ORD-005',
      customerName: 'Vikram Mehta',
      customerPhone: '+91 54321 09876',
      customerAddress: '234, Park Street, Kolkata',
      orderDate: new Date(2023, 9, 16),
      deliveryDate: new Date(2023, 9, 19),
      status: 'Pending',
      totalAmount: 980,
      paymentMethod: 'Online Payment',
      paymentStatus: 'Paid',
      items: [
        { id: 1, name: 'Basmati Rice', quantity: 5, unit: 'kg', price: 120, total: 600 },
        { id: 2, name: 'Fresh Milk', quantity: 4, unit: 'liter', price: 60, total: 240 },
        { id: 3, name: 'Whole Wheat Bread', quantity: 3, unit: 'loaf', price: 40, total: 120 },
        { id: 4, name: 'Turmeric Powder', quantity: 0.1, unit: 'kg', price: 200, total: 20 },
      ],
    },
  ];

  const displayOrders = orders?.data || mockOrders;

  // Get unique statuses for filter
  const statuses = ['all', ...new Set(displayOrders.map(order => order.status))];

  // Filter orders based on search term, status filter, and tab value
  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Tab 0: All, Tab 1: Pending/Processing, Tab 2: Shipped, Tab 3: Delivered, Tab 4: Cancelled
    let matchesTab = true;
    if (tabValue === 1) {
      matchesTab = order.status === 'Pending' || order.status === 'Processing';
    } else if (tabValue === 2) {
      matchesTab = order.status === 'Shipped';
    } else if (tabValue === 3) {
      matchesTab = order.status === 'Delivered';
    } else if (tabValue === 4) {
      matchesTab = order.status === 'Cancelled';
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleOpenUpdateStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setUpdateStatusDialogOpen(true);
  };

  const handleCloseUpdateStatusDialog = () => {
    setUpdateStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleUpdateOrderStatus = () => {
    if (selectedOrder && newStatus) {
      updateOrderStatusMutation.mutate({
        orderId: selectedOrder.id,
        status: newStatus,
      });
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pending':
        return { bg: 'warning.light', color: 'warning.dark' };
      case 'Processing':
        return { bg: 'info.light', color: 'info.dark' };
      case 'Shipped':
        return { bg: 'primary.light', color: 'primary.dark' };
      case 'Delivered':
        return { bg: 'success.light', color: 'success.dark' };
      case 'Cancelled':
        return { bg: 'error.light', color: 'error.dark' };
      default:
        return { bg: 'grey.200', color: 'grey.800' };
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
                Supplier Account
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
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Track and manage all your customer orders in one place.
            </Typography>
          </Box>

          {/* Status update message */}
          {statusUpdateMessage && (
            <Alert 
              severity={statusUpdateMessage.type} 
              sx={{ mb: 3 }}
              onClose={() => setStatusUpdateMessage(null)}
            >
              {statusUpdateMessage.message}
            </Alert>
          )}

          {/* Search and filter */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by order ID, customer name, or phone..."
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Order status tabs */}
          <Paper sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  py: 2,
                },
              }}
            >
              <Tab label="All Orders" />
              <Tab label="Pending & Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Paper>

          {/* Orders list */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <Box>
              {filteredOrders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found matching your filters.
                  </Typography>
                </Paper>
              ) : (
                filteredOrders.map((order) => (
                  <Paper
                    key={order.id}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: expandedOrder === order.id ? 3 : 1,
                    }}
                  >
                    {/* Order header */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: expandedOrder === order.id ? 'primary.50' : 'background.paper',
                        borderBottom: expandedOrder === order.id ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Order ID
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {order.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Customer
                          </Typography>
                          <Typography variant="body1">{order.customerName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Order Date
                          </Typography>
                          <Typography variant="body2">
                            {order.orderDate.toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Total
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            ₹{order.totalAmount.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                bgcolor: getStatusChipColor(order.status).bg,
                                color: getStatusChipColor(order.status).color,
                                fontWeight: 'medium',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleExpandOrder(order.id)}
                              sx={{ ml: 1 }}
                            >
                              {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Order details (expanded) */}
                    <Collapse in={expandedOrder === order.id}>
                      <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          {/* Customer details */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Customer Details
                                </Typography>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Name
                                    </Typography>
                                    <Typography variant="body1">{order.customerName}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Phone
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Phone fontSize="small" color="action" />
                                      <Typography variant="body1">{order.customerPhone}</Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Delivery Address
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                      <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                      <Typography variant="body1">{order.customerAddress}</Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Order details */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Order Details
                                </Typography>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Order Date
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <AccessTime fontSize="small" color="action" />
                                      <Typography variant="body1">
                                        {order.orderDate.toLocaleDateString()} at{' '}
                                        {order.orderDate.toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Expected Delivery
                                    </Typography>
                                    <Typography variant="body1">
                                      {order.deliveryDate.toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Payment Method
                                    </Typography>
                                    <Typography variant="body1">{order.paymentMethod}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Payment Status
                                    </Typography>
                                    <Chip
                                      label={order.paymentStatus}
                                      size="small"
                                      color={
                                        order.paymentStatus === 'Paid'
                                          ? 'success'
                                          : order.paymentStatus === 'Pending'
                                          ? 'warning'
                                          : 'default'
                                      }
                                      variant="outlined"
                                    />
                                  </Box>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Order status */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Order Status
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Current Status
                                  </Typography>
                                  <Chip
                                    label={order.status}
                                    sx={{
                                      bgcolor: getStatusChipColor(order.status).bg,
                                      color: getStatusChipColor(order.status).color,
                                      fontWeight: 'medium',
                                      px: 1,
                                    }}
                                  />
                                </Box>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  onClick={() => handleOpenUpdateStatusDialog(order)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  startIcon={<LocalShipping />}
                                >
                                  Update Status
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Order items */}
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                              Order Items
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead sx={{ bgcolor: 'grey.50' }}>
                                  <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Unit Price</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell align="right">
                                        {item.quantity} {item.unit}
                                      </TableCell>
                                      <TableCell align="right">₹{item.price.toLocaleString()}</TableCell>
                                      <TableCell align="right">₹{item.total.toLocaleString()}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell colSpan={2} />
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">Total Amount</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle1" fontWeight="bold">
                                        ₹{order.totalAmount.toLocaleString()}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onClose={handleCloseUpdateStatusDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Order ID: {selectedOrder?.id}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="new-status-label">New Status</InputLabel>
              <Select
                labelId="new-status-label"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseUpdateStatusDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateOrderStatus}
            startIcon={<CheckCircle />}
            disabled={updateOrderStatusMutation.isLoading}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}