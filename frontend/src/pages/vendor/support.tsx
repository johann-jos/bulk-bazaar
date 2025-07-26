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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore,
  LiveHelp,
  ContactSupport,
  Email,
  Phone,
  WhatsApp,
  Help,
  Info,
  Warning,
  Error,
  QuestionAnswer,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { vendorAPI } from '@/utils/api';
import { format } from 'date-fns';

export default function VendorSupport() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketType, setTicketType] = useState('general');
  const [ticketPriority, setTicketPriority] = useState('medium');

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

  // In a real application, you would fetch support tickets
  // const { data: tickets, isLoading } = useQuery('vendorTickets', vendorAPI.getSupportTickets);
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

  // Mock support tickets for UI development
  const mockTickets = [
    {
      id: 'TKT-001',
      subject: 'Payment issue with order #ORD-002',
      description: 'I made a payment for order #ORD-002 but it still shows as pending in my dashboard.',
      status: 'open',
      priority: 'high',
      type: 'payment',
      createdAt: new Date(2023, 9, 28),
      updatedAt: new Date(2023, 9, 29),
      messages: [
        {
          id: 'MSG-001',
          sender: 'user',
          content: 'I made a payment for order #ORD-002 but it still shows as pending in my dashboard.',
          timestamp: new Date(2023, 9, 28, 14, 30),
        },
        {
          id: 'MSG-002',
          sender: 'support',
          content: 'Thank you for reporting this issue. We are looking into it and will update you shortly.',
          timestamp: new Date(2023, 9, 29, 10, 15),
        },
      ],
    },
    {
      id: 'TKT-002',
      subject: 'Question about bulk ordering',
      description: 'I want to place a bulk order from multiple suppliers. Is there a way to do this in a single transaction?',
      status: 'closed',
      priority: 'medium',
      type: 'general',
      createdAt: new Date(2023, 9, 20),
      updatedAt: new Date(2023, 9, 22),
      messages: [
        {
          id: 'MSG-003',
          sender: 'user',
          content: 'I want to place a bulk order from multiple suppliers. Is there a way to do this in a single transaction?',
          timestamp: new Date(2023, 9, 20, 9, 45),
        },
        {
          id: 'MSG-004',
          sender: 'support',
          content: 'Currently, orders need to be placed separately for each supplier. However, we are working on a bulk order feature that will be available in the next update.',
          timestamp: new Date(2023, 9, 21, 11, 20),
        },
        {
          id: 'MSG-005',
          sender: 'user',
          content: 'Thank you for the information. Looking forward to the new feature.',
          timestamp: new Date(2023, 9, 21, 14, 10),
        },
        {
          id: 'MSG-006',
          sender: 'support',
          content: 'You\'re welcome! We\'ll notify you when the feature is available.',
          timestamp: new Date(2023, 9, 22, 9, 30),
        },
      ],
    },
    {
      id: 'TKT-003',
      subject: 'Delivery delay for order #ORD-003',
      description: 'My order #ORD-003 was supposed to be delivered yesterday but I haven\'t received it yet.',
      status: 'in_progress',
      priority: 'high',
      type: 'delivery',
      createdAt: new Date(2023, 10, 5),
      updatedAt: new Date(2023, 10, 6),
      messages: [
        {
          id: 'MSG-007',
          sender: 'user',
          content: 'My order #ORD-003 was supposed to be delivered yesterday but I haven\'t received it yet.',
          timestamp: new Date(2023, 10, 5, 16, 20),
        },
        {
          id: 'MSG-008',
          sender: 'support',
          content: 'We apologize for the delay. We have contacted the logistics team and they informed us that there was a delay due to heavy rain in your area. The order should be delivered by tomorrow.',
          timestamp: new Date(2023, 10, 6, 10, 45),
        },
      ],
    },
  ];

  // Mock FAQs for UI development
  const mockFAQs = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, browse suppliers, select the products you want, add them to your cart, and proceed to checkout. You can review your order before confirming the purchase.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, net banking, UPI, and wallet payments. All transactions are secure and encrypted.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by going to the "My Orders" section in your dashboard. Each order has a status that is updated in real-time.',
    },
    {
      question: 'What if I receive damaged goods?',
      answer: 'If you receive damaged goods, please report it within 24 hours of delivery. You can raise a dispute from the order details page, and our team will assist you with the return and refund process.',
    },
    {
      question: 'How do I contact a supplier directly?',
      answer: 'You can contact a supplier directly from their profile page. Click on the "Contact Supplier" button and you can send them a message through our platform.',
    },
    {
      question: 'What is the return policy?',
      answer: 'Return policies may vary by supplier. Generally, you can return products within 7 days of delivery if they are damaged, defective, or not as described. Check the supplier\'s profile for specific return policies.',
    },
    {
      question: 'How do I cancel an order?',
      answer: 'You can cancel an order before it is shipped. Go to "My Orders" in your dashboard, select the order you want to cancel, and click on the "Cancel Order" button. Once an order is shipped, you cannot cancel it.',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenTicketDialog = () => {
    setOpenTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setTicketSubject('');
    setTicketDescription('');
    setTicketType('general');
    setTicketPriority('medium');
  };

  const handleSubmitTicket = () => {
    // In a real application, you would submit the ticket to the backend
    // vendorAPI.createSupportTicket({ subject: ticketSubject, description: ticketDescription, type: ticketType, priority: ticketPriority })
    console.log('Submitting ticket:', { subject: ticketSubject, description: ticketDescription, type: ticketType, priority: ticketPriority });
    handleCloseTicketDialog();
  };

  // Filter tickets based on search term
  const filteredTickets = mockTickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter FAQs based on search term
  const filteredFAQs = mockFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status chip color
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'open':
        return { color: 'info', icon: <Info fontSize="small" /> };
      case 'in_progress':
        return { color: 'warning', icon: <Schedule fontSize="small" /> };
      case 'closed':
        return { color: 'success', icon: <CheckCircle fontSize="small" /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  // Get priority chip color
  const getPriorityChipProps = (priority) => {
    switch (priority) {
      case 'high':
        return { color: 'error' };
      case 'medium':
        return { color: 'warning' };
      case 'low':
        return { color: 'success' };
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
              SahiSauda - Support
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
              Support Center
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Get help with your orders, payments, and other inquiries.
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
                  placeholder="Search for help..."
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
                  onClick={handleOpenTicketDialog}
                >
                  Create Support Ticket
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Quick contact cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      <Email sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6">Email Support</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Send us an email and we'll get back to you within 24 hours.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Email />}
                      href="mailto:support@sahisauda.com"
                    >
                      support@sahisauda.com
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                      <WhatsApp sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6">WhatsApp Support</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chat with our support team on WhatsApp for quick assistance.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<WhatsApp />}
                      href="https://wa.me/919876543210"
                      target="_blank"
                      sx={{ color: 'success.main', borderColor: 'success.main' }}
                    >
                      +91 9876543210
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                      <Phone sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6">Phone Support</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Call our customer support line for immediate assistance.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      href="tel:+919876543210"
                      sx={{ color: 'error.main', borderColor: 'error.main' }}
                    >
                      +91 9876543210
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs for different support categories */}
          <Paper sx={{ borderRadius: 2, mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<QuestionAnswer />} label="FAQs" />
              <Tab icon={<ContactSupport />} label="My Tickets" />
            </Tabs>
          </Paper>

          {/* Support content based on selected tab */}
          {isLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <Box>
              {/* FAQs Tab */}
              {tabValue === 0 && (
                <Box>
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                      <Accordion key={index} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="text.secondary">
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        No FAQs found matching your search criteria.
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}

              {/* My Tickets Tab */}
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                      const statusProps = getStatusChipProps(ticket.status);
                      const priorityProps = getPriorityChipProps(ticket.priority);
                      
                      return (
                        <Grid item xs={12} key={ticket.id}>
                          <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <Typography variant="h6" gutterBottom>
                                    {ticket.subject}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                    <Chip
                                      size="small"
                                      label={ticket.status.replace('_', ' ').toUpperCase()}
                                      color={statusProps.color}
                                      icon={statusProps.icon}
                                    />
                                    <Chip
                                      size="small"
                                      label={ticket.priority.toUpperCase()}
                                      color={priorityProps.color}
                                    />
                                    <Chip
                                      size="small"
                                      label={ticket.type.toUpperCase()}
                                      variant="outlined"
                                    />
                                    <Typography variant="caption" sx={{ ml: { xs: 0, sm: 1 }, color: 'text.secondary' }}>
                                      Created: {format(ticket.createdAt, 'dd MMM yyyy')}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" paragraph>
                                    {ticket.description}
                                  </Typography>
                                  
                                  {/* Latest message preview */}
                                  {ticket.messages.length > 0 && (
                                    <Paper
                                      sx={{
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        mt: 2,
                                      }}
                                    >
                                      <Typography variant="subtitle2" gutterBottom>
                                        Latest Message:
                                      </Typography>
                                      <Typography variant="body2">
                                        {ticket.messages[ticket.messages.length - 1].content}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        {format(ticket.messages[ticket.messages.length - 1].timestamp, 'dd MMM yyyy, HH:mm')}
                                      </Typography>
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
                                    <Typography variant="body2" color="text.secondary">
                                      Ticket #{ticket.id}
                                    </Typography>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                      <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => router.push(`/vendor/support/${ticket.id}`)}
                                      >
                                        View Details
                                      </Button>
                                    </Stack>
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          No support tickets found matching your search criteria.
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

      {/* Create Ticket Dialog */}
      <Dialog open={openTicketDialog} onClose={handleCloseTicketDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Subject"
              fullWidth
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="Brief description of your issue"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                  <Select
                    labelId="ticket-type-label"
                    value={ticketType}
                    label="Ticket Type"
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <MenuItem value="general">General Inquiry</MenuItem>
                    <MenuItem value="payment">Payment Issue</MenuItem>
                    <MenuItem value="delivery">Delivery Problem</MenuItem>
                    <MenuItem value="product">Product Quality</MenuItem>
                    <MenuItem value="technical">Technical Issue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="ticket-priority-label">Priority</InputLabel>
                  <Select
                    labelId="ticket-priority-label"
                    value={ticketPriority}
                    label="Priority"
                    onChange={(e) => setTicketPriority(e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Please provide details about your issue..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseTicketDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitTicket}
            disabled={!ticketSubject || !ticketDescription}
            startIcon={<Send />}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}