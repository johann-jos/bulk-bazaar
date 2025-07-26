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
  Rating,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Send,
  Reply,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { vendorAPI } from '@/utils/api';
import { format } from 'date-fns';

export default function VendorReviews() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number | null>(null);

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

  // Fetch reviews data
  // In a real application, you would use something like:
  // const { data: reviews, isLoading } = useQuery('vendorReviews', vendorAPI.getReviews);
  const isLoading = false; // Mock loading state

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

  // Mock reviews data for UI development
  const mockReviews = {
    given: [
      {
        id: 'REV-001',
        supplier: 'Organic Farms Ltd',
        supplierId: 'SUP-001',
        orderId: 'ORD-001',
        rating: 4,
        comment: 'Great quality products, but delivery was slightly delayed.',
        date: new Date(2023, 9, 20),
        response: 'Thank you for your feedback. We apologize for the delay and are working to improve our delivery process.',
      },
      {
        id: 'REV-002',
        supplier: 'Fresh Dairy Products',
        supplierId: 'SUP-002',
        orderId: 'ORD-002',
        rating: 5,
        comment: 'Excellent quality and timely delivery. Will order again!',
        date: new Date(2023, 9, 25),
        response: null,
      },
      {
        id: 'REV-003',
        supplier: 'Spice World Exports',
        supplierId: 'SUP-003',
        orderId: 'ORD-003',
        rating: 3,
        comment: 'The spices were good but packaging could be improved.',
        date: new Date(2023, 10, 2),
        response: 'We appreciate your feedback and are currently upgrading our packaging. Your next order will have our new improved packaging.',
      },
    ],
    pending: [
      {
        id: 'ORD-004',
        supplier: 'Grain Harvest Co.',
        supplierId: 'SUP-004',
        date: new Date(2023, 10, 5),
        items: ['Wheat Flour', 'Rice'],
      },
      {
        id: 'ORD-005',
        supplier: 'Sweet Delights Bakery',
        supplierId: 'SUP-005',
        date: new Date(2023, 10, 8),
        items: ['Whole Wheat Bread', 'Butter Cookies'],
      },
    ],
  };

  // Mock suppliers for the review dialog
  const mockSuppliers = [
    { id: 'SUP-001', name: 'Organic Farms Ltd' },
    { id: 'SUP-002', name: 'Fresh Dairy Products' },
    { id: 'SUP-003', name: 'Spice World Exports' },
    { id: 'SUP-004', name: 'Grain Harvest Co.' },
    { id: 'SUP-005', name: 'Sweet Delights Bakery' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedSupplier('');
    setReviewText('');
    setRating(null);
  };

  const handleSubmitReview = () => {
    // In a real application, you would submit the review to the backend
    // vendorAPI.submitReview({ supplierId: selectedSupplier, rating, comment: reviewText })
    console.log('Submitting review:', { supplierId: selectedSupplier, rating, comment: reviewText });
    handleCloseReviewDialog();
  };

  // Filter reviews based on search term
  const filteredReviews = mockReviews.given.filter((review) =>
    review.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingReviews = mockReviews.pending.filter((review) =>
    review.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              SahiSauda - Reviews
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
              Reviews
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your reviews and feedback for suppliers.
            </Typography>
          </Box>

          {/* Search and action buttons */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search reviews..."
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
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.5 }}
                  onClick={handleOpenReviewDialog}
                >
                  Write Review
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs for different review categories */}
          <Paper sx={{ borderRadius: 2, mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="My Reviews" />
              <Tab label="Pending Reviews" />
            </Tabs>
          </Paper>

          {/* Reviews content based on selected tab */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <Box>
              {/* My Reviews Tab */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <Grid item xs={12} key={review.id}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="h6" gutterBottom>
                                  {review.supplier}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Rating value={review.rating} readOnly size="small" />
                                  <Typography variant="body2" sx={{ ml: 1 }}>
                                    {review.rating}/5
                                  </Typography>
                                  <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                                    {format(review.date, 'dd MMM yyyy')}
                                  </Typography>
                                </Box>
                                <Typography variant="body1" paragraph>
                                  {review.comment}
                                </Typography>
                                {review.response && (
                                  <Paper
                                    sx={{
                                      p: 2,
                                      bgcolor: 'grey.50',
                                      borderRadius: 2,
                                      mt: 2,
                                    }}
                                  >
                                    <Typography variant="subtitle2" gutterBottom>
                                      Response from {review.supplier}:
                                    </Typography>
                                    <Typography variant="body2">{review.response}</Typography>
                                  </Paper>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'flex-start', sm: 'flex-end' },
                                    height: '100%',
                                  }}
                                >
                                  <Chip
                                    label={`Order #${review.orderId}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <Box sx={{ flexGrow: 1 }} />
                                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <Button
                                      size="small"
                                      startIcon={<Edit />}
                                      variant="outlined"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="small"
                                      startIcon={<Delete />}
                                      color="error"
                                      variant="outlined"
                                    >
                                      Delete
                                    </Button>
                                  </Stack>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          No reviews found matching your search criteria.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Pending Reviews Tab */}
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  {filteredPendingReviews.length > 0 ? (
                    filteredPendingReviews.map((review) => (
                      <Grid item xs={12} sm={6} md={4} key={review.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {review.supplier}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Order #{review.id} • {format(review.date, 'dd MMM yyyy')}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="subtitle2" gutterBottom>
                              Items Purchased:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                              {review.items.map((item, index) => (
                                <Chip key={index} label={item} size="small" sx={{ mb: 0.5 }} />
                              ))}
                            </Stack>
                          </CardContent>
                          <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<RateReview />}
                              onClick={() => {
                                setSelectedSupplier(review.supplierId);
                                handleOpenReviewDialog();
                              }}
                            >
                              Write Review
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          No pending reviews found matching your search criteria.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Write Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="supplier-select-label">Select Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                value={selectedSupplier}
                label="Select Supplier"
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                {mockSuppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography component="legend" gutterBottom>
                Rating
              </Typography>
              <Rating
                name="supplier-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />
            </Box>

            <TextField
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this supplier..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!selectedSupplier || !rating || !reviewText}
            startIcon={<Send />}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}