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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  Inventory,
  ShoppingCart,
  Analytics as AnalyticsIcon,
  People,
  Notifications,
  Logout,
  TrendingUp,
  AttachMoney,
  LocalShipping,
  ShoppingBasket,
  Category,
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { supplierAPI } from '@/utils/api';

// Import chart components (assuming you're using recharts)
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SupplierAnalytics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [tabValue, setTabValue] = useState(0);

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

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery(
    ['supplierAnalytics', timeRange],
    () => supplierAPI.getAnalytics(timeRange)
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const navigationItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/supplier/dashboard' },
    { icon: <Inventory />, text: 'Inventory', path: '/supplier/inventory' },
    { icon: <ShoppingCart />, text: 'Orders', path: '/supplier/orders' },
    { icon: <AnalyticsIcon />, text: 'Analytics', path: '/supplier/analytics' },
    { icon: <People />, text: 'Customers', path: '/supplier/customers' },
  ];

  // Mock analytics data for UI development
  const mockSalesData = [
    { name: 'Jan', sales: 45000 },
    { name: 'Feb', sales: 52000 },
    { name: 'Mar', sales: 49000 },
    { name: 'Apr', sales: 58000 },
    { name: 'May', sales: 63000 },
    { name: 'Jun', sales: 59000 },
    { name: 'Jul', sales: 67000 },
    { name: 'Aug', sales: 72000 },
    { name: 'Sep', sales: 78000 },
    { name: 'Oct', sales: 82000 },
    { name: 'Nov', sales: 0 },
    { name: 'Dec', sales: 0 },
  ];

  const mockOrdersData = [
    { name: 'Jan', orders: 120 },
    { name: 'Feb', orders: 145 },
    { name: 'Mar', orders: 132 },
    { name: 'Apr', orders: 158 },
    { name: 'May', orders: 175 },
    { name: 'Jun', orders: 162 },
    { name: 'Jul', orders: 180 },
    { name: 'Aug', orders: 195 },
    { name: 'Sep', orders: 210 },
    { name: 'Oct', orders: 225 },
    { name: 'Nov', orders: 0 },
    { name: 'Dec', orders: 0 },
  ];

  const mockCategoryData = [
    { name: 'Vegetables', value: 35 },
    { name: 'Dairy', value: 25 },
    { name: 'Grains', value: 20 },
    { name: 'Spices', value: 15 },
    { name: 'Bakery', value: 5 },
  ];

  const mockProductPerformance = [
    { name: 'Organic Tomatoes', sales: 32000, orders: 400 },
    { name: 'Fresh Milk', sales: 28000, orders: 467 },
    { name: 'Basmati Rice', sales: 60000, orders: 500 },
    { name: 'Turmeric Powder', sales: 14000, orders: 50 },
    { name: 'Whole Wheat Bread', sales: 12000, orders: 300 },
  ];

  const mockCustomerData = [
    { name: 'New', value: 35 },
    { name: 'Returning', value: 65 },
  ];

  const mockSummaryData = {
    totalSales: 625000,
    totalOrders: 1702,
    averageOrderValue: 367,
    totalProducts: 25,
    salesGrowth: 18.5,
    ordersGrowth: 12.3,
  };

  // Use mock data for UI development
  const displayData = analyticsData?.data || {
    salesData: mockSalesData,
    ordersData: mockOrdersData,
    categoryData: mockCategoryData,
    productPerformance: mockProductPerformance,
    customerData: mockCustomerData,
    summary: mockSummaryData,
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
              SahiSauda - Analytics
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
              Analytics & Reports
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Track your business performance and make data-driven decisions.
            </Typography>
          </Box>

          {/* Time range selector */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="time-range-label">Time Range</InputLabel>
                  <Select
                    labelId="time-range-label"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    label="Time Range"
                  >
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="quarter">Last 3 Months</MenuItem>
                    <MenuItem value="year">Last 12 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Custom Date Range
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: '56px' }}
                  onClick={() => {
                    // Download report functionality would go here
                    alert('Report download functionality will be implemented');
                  }}
                >
                  Download Report
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Sales
                    </Typography>
                    <Typography variant="h4" component="div">
                      ₹{displayData.summary.totalSales.toLocaleString()}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {displayData.summary.salesGrowth > 0 ? (
                        <ArrowUpward fontSize="small" color="success" />
                      ) : (
                        <ArrowDownward fontSize="small" color="error" />
                      )}
                      <Typography
                        variant="body2"
                        color={displayData.summary.salesGrowth > 0 ? 'success.main' : 'error.main'}
                      >
                        {Math.abs(displayData.summary.salesGrowth)}% from previous period
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h4" component="div">
                      {displayData.summary.totalOrders.toLocaleString()}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {displayData.summary.ordersGrowth > 0 ? (
                        <ArrowUpward fontSize="small" color="success" />
                      ) : (
                        <ArrowDownward fontSize="small" color="error" />
                      )}
                      <Typography
                        variant="body2"
                        color={displayData.summary.ordersGrowth > 0 ? 'success.main' : 'error.main'}
                      >
                        {Math.abs(displayData.summary.ordersGrowth)}% from previous period
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Order Value
                    </Typography>
                    <Typography variant="h4" component="div">
                      ₹{displayData.summary.averageOrderValue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Per order average
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Products
                    </Typography>
                    <Typography variant="h4" component="div">
                      {displayData.summary.totalProducts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active in inventory
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs for different analytics views */}
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
              <Tab label="Sales & Orders" />
              <Tab label="Products" />
              <Tab label="Customers" />
            </Tabs>
          </Paper>

          {/* Sales & Orders Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Sales Trend Chart */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Sales Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Monthly sales performance over time
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={displayData.salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke={theme.palette.primary.main}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Orders Trend Chart */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Orders Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Monthly order count
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={displayData.ordersData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Orders']} />
                        <Bar dataKey="orders" fill={theme.palette.secondary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Category Distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Sales by Category
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Distribution of sales across product categories
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData.categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {displayData.categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Customer Distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    New vs. returning customers
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData.customerData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={theme.palette.primary.light} />
                          <Cell fill={theme.palette.primary.dark} />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Products Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {/* Top Products */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Products with highest sales and order volume
                  </Typography>
                  <Box sx={{ height: 400, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={displayData.productPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value, name) => [
                          name === 'sales' ? `₹${value.toLocaleString()}` : value,
                          name === 'sales' ? 'Sales' : 'Orders'
                        ]} />
                        <Legend />
                        <Bar dataKey="sales" name="Sales (₹)" fill={theme.palette.primary.main} />
                        <Bar dataKey="orders" name="Orders" fill={theme.palette.secondary.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Product Category Distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Product Category Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Number of products in each category
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData.categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {displayData.categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Inventory Status */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Inventory Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Current inventory levels by category
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={displayData.categoryData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Inventory %" fill={theme.palette.info.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Customers Tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {/* Customer Growth */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Growth
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    New customer acquisition over time
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={displayData.ordersData} // Using orders data as a placeholder
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          name="New Customers"
                          stroke={theme.palette.success.main}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Customer Distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Distribution of customer types
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayData.customerData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={theme.palette.primary.light} />
                          <Cell fill={theme.palette.primary.dark} />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Customer Retention */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Retention Rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Percentage of customers who return to make additional purchases
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={displayData.salesData} // Using sales data as a placeholder
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          name="Retention Rate"
                          stroke={theme.palette.warning.main}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}