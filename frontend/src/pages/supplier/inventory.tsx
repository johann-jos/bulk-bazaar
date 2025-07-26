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
  FormHelperText,
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
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Visibility,
  Image,
  Save,
  Cancel as CancelIcon,
  AttachMoney,
  Category,
  Description,
  LocalOffer,
  Inventory2,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supplierAPI } from '@/utils/api';

export default function SupplierInventory() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    unit: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});

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

  // Fetch products data
  const { data: products, isLoading } = useQuery('supplierProducts', supplierAPI.getProducts);

  const queryClient = useQueryClient();

  // Add product mutation
  const addProductMutation = useMutation(supplierAPI.addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('supplierProducts');
      handleCloseProductDialog();
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation(supplierAPI.updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('supplierProducts');
      handleCloseProductDialog();
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation(supplierAPI.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('supplierProducts');
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

  // Mock products data for UI development
  const mockProducts = [
    {
      id: 'PRD-001',
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides.',
      price: 80,
      category: 'Vegetables',
      stock: 200,
      unit: 'kg',
      image: '/products/tomatoes.jpg',
      createdAt: new Date(2023, 8, 15),
      updatedAt: new Date(2023, 9, 10),
    },
    {
      id: 'PRD-002',
      name: 'Fresh Milk',
      description: 'Pure cow milk from our own dairy farm.',
      price: 60,
      category: 'Dairy',
      stock: 100,
      unit: 'liter',
      image: '/products/milk.jpg',
      createdAt: new Date(2023, 8, 20),
      updatedAt: new Date(2023, 9, 5),
    },
    {
      id: 'PRD-003',
      name: 'Turmeric Powder',
      description: 'High-quality turmeric powder with rich color and aroma.',
      price: 300,
      category: 'Spices',
      stock: 50,
      unit: 'kg',
      image: '/products/turmeric.jpg',
      createdAt: new Date(2023, 9, 1),
      updatedAt: new Date(2023, 9, 1),
    },
    {
      id: 'PRD-004',
      name: 'Basmati Rice',
      description: 'Premium long-grain basmati rice.',
      price: 120,
      category: 'Grains',
      stock: 500,
      unit: 'kg',
      image: '/products/rice.jpg',
      createdAt: new Date(2023, 9, 5),
      updatedAt: new Date(2023, 9, 5),
    },
    {
      id: 'PRD-005',
      name: 'Whole Wheat Bread',
      description: 'Freshly baked whole wheat bread.',
      price: 40,
      category: 'Bakery',
      stock: 30,
      unit: 'loaf',
      image: '/products/bread.jpg',
      createdAt: new Date(2023, 9, 10),
      updatedAt: new Date(2023, 9, 10),
    },
  ];

  const displayProducts = products?.data || mockProducts;

  // Get unique categories for filter
  const categories = ['all', ...new Set(displayProducts.map(product => product.category))];

  // Filter products based on search term and category filter
  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenProductDialog = (product = null) => {
    if (product) {
      setIsEditMode(true);
      setCurrentProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        unit: product.unit,
        image: product.image,
      });
    } else {
      setIsEditMode(false);
      setCurrentProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        unit: '',
        image: '',
      });
    }
    setFormErrors({});
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      unit: '',
      image: '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: any = {};
    if (!productForm.name) errors.name = 'Product name is required';
    if (!productForm.description) errors.description = 'Description is required';
    if (!productForm.price) errors.price = 'Price is required';
    else if (isNaN(Number(productForm.price)) || Number(productForm.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!productForm.category) errors.category = 'Category is required';
    if (!productForm.stock) errors.stock = 'Stock quantity is required';
    else if (isNaN(Number(productForm.stock)) || Number(productForm.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    if (!productForm.unit) errors.unit = 'Unit is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitProduct = () => {
    if (!validateForm()) return;

    const productData = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    };

    if (isEditMode && currentProduct) {
      updateProductMutation.mutate({ id: currentProduct.id, ...productData });
    } else {
      addProductMutation.mutate(productData);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value,
    }));
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
              SahiSauda - Inventory
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
              Inventory Management
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your products, stock levels, and pricing.
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
                  placeholder="Search products..."
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
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.5 }}
                  onClick={() => handleOpenProductDialog()}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Products table */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Price (₹)</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}
                          >
                            <Image />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">₹{product.price.toLocaleString()}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          per {product.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          fontWeight="medium"
                          color={product.stock < 10 ? 'error.main' : 'inherit'}
                        >
                          {product.stock.toLocaleString()} {product.unit}
                        </Typography>
                        {product.stock < 10 && (
                          <Chip
                            label="Low Stock"
                            size="small"
                            color="error"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenProductDialog(product)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredProducts.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found matching your filters.
                  </Typography>
                </Box>
              )}
            </TableContainer>
          )}
        </Container>
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={productForm.category}
                onChange={handleInputChange}
                error={!!formErrors.category}
                helperText={formErrors.category}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                value={productForm.price}
                onChange={handleInputChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    error={!!formErrors.stock}
                    helperText={formErrors.stock}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Inventory2 fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Unit"
                    name="unit"
                    value={productForm.unit}
                    onChange={handleInputChange}
                    error={!!formErrors.unit}
                    helperText={formErrors.unit}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                error={!!formErrors.description}
                helperText={formErrors.description}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={productForm.image}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                helperText="Enter a URL for the product image or leave blank for default"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseProductDialog}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitProduct}
            startIcon={<Save />}
            disabled={addProductMutation.isLoading || updateProductMutation.isLoading}
          >
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}