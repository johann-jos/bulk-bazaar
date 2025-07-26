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
  Rating,
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
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  ShoppingBasket,
  Star,
  ExpandMore,
  ExpandLess,
  Send,
  Cancel,
  MoreVert,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supplierAPI } from '@/utils/api';

export default function SupplierCustomers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

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

  // Fetch customers data
  const { data: customers, isLoading } = useQuery('supplierCustomers', supplierAPI.getCustomers);

  const queryClient = useQueryClient();

  // Send message mutation
  const sendMessageMutation = useMutation(supplierAPI.sendCustomerMessage, {
    onSuccess: () => {
      setMessageSent(true);
      setTimeout(() => {
        handleCloseMessageDialog();
        setMessageSent(false);
      }, 2000);
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

  // Mock customers data for UI development
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 98765 43210',
      address: '123, Green Park, New Delhi',
      joinDate: new Date(2023, 5, 15),
      totalOrders: 12,
      totalSpent: 8500,
      lastOrderDate: new Date(2023, 9, 10),
      type: 'Regular',
      rating: 4.5,
      notes: 'Prefers organic products. Usually orders on weekends.',
      recentOrders: [
        { id: 'ORD-042', date: new Date(2023, 9, 10), amount: 1250, status: 'Delivered' },
        { id: 'ORD-035', date: new Date(2023, 8, 25), amount: 980, status: 'Delivered' },
        { id: 'ORD-028', date: new Date(2023, 8, 12), amount: 1100, status: 'Delivered' },
      ],
    },
    {
      id: 'CUST-002',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 87654 32109',
      address: '456, Sector 18, Noida',
      joinDate: new Date(2023, 6, 20),
      totalOrders: 8,
      totalSpent: 5200,
      lastOrderDate: new Date(2023, 9, 15),
      type: 'Regular',
      rating: 5.0,
      notes: 'Always pays online. Interested in dairy products.',
      recentOrders: [
        { id: 'ORD-045', date: new Date(2023, 9, 15), amount: 850, status: 'Processing' },
        { id: 'ORD-038', date: new Date(2023, 9, 2), amount: 720, status: 'Delivered' },
        { id: 'ORD-031', date: new Date(2023, 8, 18), amount: 650, status: 'Delivered' },
      ],
    },
    {
      id: 'CUST-003',
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 76543 21098',
      address: '789, MG Road, Bangalore',
      joinDate: new Date(2023, 4, 10),
      totalOrders: 15,
      totalSpent: 12000,
      lastOrderDate: new Date(2023, 9, 8),
      type: 'VIP',
      rating: 4.8,
      notes: 'Bulk orders for restaurant. Needs early morning delivery.',
      recentOrders: [
        { id: 'ORD-041', date: new Date(2023, 9, 8), amount: 1560, status: 'Delivered' },
        { id: 'ORD-034', date: new Date(2023, 8, 22), amount: 1800, status: 'Delivered' },
        { id: 'ORD-027', date: new Date(2023, 8, 8), amount: 1450, status: 'Delivered' },
      ],
    },
    {
      id: 'CUST-004',
      name: 'Sunita Patel',
      email: 'sunita.patel@example.com',
      phone: '+91 65432 10987',
      address: '101, Civil Lines, Jaipur',
      joinDate: new Date(2023, 7, 5),
      totalOrders: 5,
      totalSpent: 3200,
      lastOrderDate: new Date(2023, 9, 1),
      type: 'Occasional',
      rating: 4.0,
      notes: 'Prefers weekend delivery. Interested in organic vegetables.',
      recentOrders: [
        { id: 'ORD-037', date: new Date(2023, 9, 1), amount: 720, status: 'Delivered' },
        { id: 'ORD-030', date: new Date(2023, 8, 15), amount: 680, status: 'Delivered' },
        { id: 'ORD-023', date: new Date(2023, 7, 30), amount: 550, status: 'Delivered' },
      ],
    },
    {
      id: 'CUST-005',
      name: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      phone: '+91 54321 09876',
      address: '234, Park Street, Kolkata',
      joinDate: new Date(2023, 8, 12),
      totalOrders: 3,
      totalSpent: 2100,
      lastOrderDate: new Date(2023, 9, 16),
      type: 'New',
      rating: 4.2,
      notes: 'New customer with potential for regular orders.',
      recentOrders: [
        { id: 'ORD-046', date: new Date(2023, 9, 16), amount: 980, status: 'Shipped' },
        { id: 'ORD-039', date: new Date(2023, 9, 5), amount: 650, status: 'Delivered' },
        { id: 'ORD-032', date: new Date(2023, 8, 20), amount: 470, status: 'Delivered' },
      ],
    },
  ];

  const displayCustomers = customers?.data || mockCustomers;

  // Get unique customer types for filter
  const customerTypes = ['all', ...new Set(displayCustomers.map(customer => customer.type))];

  // Filter customers based on search term, customer type filter, and tab value
  const filteredCustomers = displayCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = customerTypeFilter === 'all' || customer.type === customerTypeFilter;
    
    // Tab 0: All, Tab 1: VIP, Tab 2: Regular, Tab 3: Occasional, Tab 4: New
    let matchesTab = true;
    if (tabValue === 1) {
      matchesTab = customer.type === 'VIP';
    } else if (tabValue === 2) {
      matchesTab = customer.type === 'Regular';
    } else if (tabValue === 3) {
      matchesTab = customer.type === 'Occasional';
    } else if (tabValue === 4) {
      matchesTab = customer.type === 'New';
    }
    
    return matchesSearch && matchesType && matchesTab;
  });

  const handleExpandCustomer = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const handleOpenMessageDialog = (customer) => {
    setSelectedCustomer(customer);
    setMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setSelectedCustomer(null);
    setMessageText('');
  };

  const handleSendMessage = () => {
    if (selectedCustomer && messageText.trim()) {
      sendMessageMutation.mutate({
        customerId: selectedCustomer.id,
        message: messageText,
      });
    }
  };

  const getCustomerTypeChipColor = (type) => {
    switch (type) {
      case 'VIP':
        return { bg: 'error.light', color: 'error.dark' };
      case 'Regular':
        return { bg: 'success.light', color: 'success.dark' };
      case 'Occasional':
        return { bg: 'warning.light', color: 'warning.dark' };
      case 'New':
        return { bg: 'info.light', color: 'info.dark' };
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
              SahiSauda - Customers
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
              Customer Management
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your customer relationships and track customer information.
            </Typography>
          </Box>

          {/* Search and filter */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, phone, or ID..."
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
                  <InputLabel id="customer-type-filter-label">Customer Type</InputLabel>
                  <Select
                    labelId="customer-type-filter-label"
                    value={customerTypeFilter}
                    onChange={(e) => setCustomerTypeFilter(e.target.value)}
                    label="Customer Type"
                  >
                    {customerTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Customer type tabs */}
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
              <Tab label="All Customers" />
              <Tab label="VIP" />
              <Tab label="Regular" />
              <Tab label="Occasional" />
              <Tab label="New" />
            </Tabs>
          </Paper>

          {/* Customers list */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <Box>
              {filteredCustomers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    No customers found matching your filters.
                  </Typography>
                </Paper>
              ) : (
                filteredCustomers.map((customer) => (
                  <Paper
                    key={customer.id}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: expandedCustomer === customer.id ? 3 : 1,
                    }}
                  >
                    {/* Customer header */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: expandedCustomer === customer.id ? 'primary.50' : 'background.paper',
                        borderBottom: expandedCustomer === customer.id ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                              }}
                            >
                              {customer.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {customer.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {customer.id}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Email fontSize="small" color="action" />
                              <Typography variant="body2">{customer.email}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Phone fontSize="small" color="action" />
                              <Typography variant="body2">{customer.phone}</Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Total Orders: <b>{customer.totalOrders}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Spent: <b>₹{customer.totalSpent.toLocaleString()}</b>
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                            <Chip
                              label={customer.type}
                              size="small"
                              sx={{
                                bgcolor: getCustomerTypeChipColor(customer.type).bg,
                                color: getCustomerTypeChipColor(customer.type).color,
                                fontWeight: 'medium',
                              }}
                            />
                            <Rating
                              value={customer.rating}
                              readOnly
                              size="small"
                              precision={0.5}
                              icon={<Star fontSize="inherit" />}
                              emptyIcon={<Star fontSize="inherit" />}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleExpandCustomer(customer.id)}
                              sx={{ ml: 1 }}
                            >
                              {expandedCustomer === customer.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Customer details (expanded) */}
                    <Collapse in={expandedCustomer === customer.id}>
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
                                      Full Name
                                    </Typography>
                                    <Typography variant="body1">{customer.name}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Email Address
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Email fontSize="small" color="action" />
                                      <Typography variant="body1">{customer.email}</Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Phone Number
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Phone fontSize="small" color="action" />
                                      <Typography variant="body1">{customer.phone}</Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Address
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                      <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                      <Typography variant="body1">{customer.address}</Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Customer Since
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <CalendarToday fontSize="small" color="action" />
                                      <Typography variant="body1">
                                        {customer.joinDate.toLocaleDateString()}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Order history */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Order History
                                </Typography>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Total Orders
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <ShoppingBasket fontSize="small" color="action" />
                                      <Typography variant="body1">{customer.totalOrders}</Typography>
                                    </Stack>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Total Spent
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                      ₹{customer.totalSpent.toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Last Order Date
                                    </Typography>
                                    <Typography variant="body1">
                                      {customer.lastOrderDate.toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Customer Rating
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Rating
                                        value={customer.rating}
                                        readOnly
                                        precision={0.5}
                                        icon={<Star fontSize="inherit" />}
                                        emptyIcon={<Star fontSize="inherit" />}
                                      />
                                      <Typography variant="body2">
                                        ({customer.rating.toFixed(1)})
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Notes and actions */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Notes & Actions
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Customer Notes
                                  </Typography>
                                  <Typography variant="body1" paragraph>
                                    {customer.notes || 'No notes available for this customer.'}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  onClick={() => handleOpenMessageDialog(customer)}
                                  startIcon={<Send />}
                                  sx={{ mb: 2 }}
                                >
                                  Send Message
                                </Button>
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  onClick={() => router.push(`/supplier/orders?customer=${customer.id}`)}
                                >
                                  View All Orders
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Recent orders */}
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                              Recent Orders
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead sx={{ bgcolor: 'grey.50' }}>
                                  <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {customer.recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell>{order.id}</TableCell>
                                      <TableCell>{order.date.toLocaleDateString()}</TableCell>
                                      <TableCell align="right">₹{order.amount.toLocaleString()}</TableCell>
                                      <TableCell>
                                        <Chip
                                          label={order.status}
                                          size="small"
                                          color={
                                            order.status === 'Delivered'
                                              ? 'success'
                                              : order.status === 'Processing'
                                              ? 'primary'
                                              : order.status === 'Shipped'
                                              ? 'info'
                                              : 'default'
                                          }
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell align="right">
                                        <Button
                                          size="small"
                                          onClick={() => router.push(`/supplier/orders?id=${order.id}`)}
                                        >
                                          View
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
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

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onClose={handleCloseMessageDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to {selectedCustomer?.name}</DialogTitle>
        <DialogContent>
          {messageSent ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Message sent successfully!
            </Alert>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              variant="outlined"
              placeholder="Type your message here..."
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        {!messageSent && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseMessageDialog} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              startIcon={<Send />}
              disabled={!messageText.trim() || sendMessageMutation.isLoading}
            >
              Send Message
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}