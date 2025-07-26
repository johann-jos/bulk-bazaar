// User types
export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'vendor' | 'supplier';
  city: string;
  state: string;
  address: string;
  pincode: string;
  business_name?: string;
  business_type?: string;
  gst_number?: string;
  is_verified: boolean;
  trust_score: number;
  trust_badge: string;
  total_orders: number;
  successful_orders: number;
  average_rating: number;
  created_at: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  name_hindi?: string;
  description?: string;
  icon?: string;
  product_count: number;
}

// Product types
export interface Product {
  id: number;
  name: string;
  name_hindi?: string;
  description?: string;
  description_hindi?: string;
  price_per_unit: number;
  unit: string;
  min_order_quantity: number;
  bulk_discount: number;
  bulk_threshold: number;
  current_stock: number;
  is_available: boolean;
  category: Category;
  supplier: {
    id: number;
    name: string;
    business_name?: string;
    city: string;
    trust_score: number;
    trust_badge: string;
  };
  quality_grade: string;
  is_organic: boolean;
  is_fssai_certified: boolean;
  image_url?: string;
  average_rating: number;
  total_sales: number;
  is_low_stock: boolean;
  created_at: string;
}

// Order types
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  quality_rating?: number;
  quality_notes?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  vendor: {
    id: number;
    name: string;
    business_name?: string;
  };
  supplier: {
    id: number;
    name: string;
    business_name?: string;
  };
  total_amount: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  final_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  delivery_instructions?: string;
  status: string;
  status_display: string;
  payment_status: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  delivery_notes?: string;
  is_group_order: boolean;
  group_order_id?: string;
  items: OrderItem[];
  can_be_cancelled: boolean;
  can_be_modified: boolean;
  delivery_status: string;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: number;
  reviewer: {
    id: number;
    name: string;
    business_name?: string;
  };
  reviewed: {
    id: number;
    name: string;
    business_name?: string;
  };
  product?: Product;
  order?: {
    id: number;
    order_number: string;
  };
  rating: number;
  overall_rating: number;
  rating_stars: string;
  title?: string;
  comment?: string;
  comment_hindi?: string;
  quality_rating?: number;
  delivery_rating?: number;
  communication_rating?: number;
  value_rating?: number;
  is_verified_purchase: boolean;
  is_helpful: boolean;
  helpful_count: number;
  supplier_response?: string;
  supplier_response_hindi?: string;
  response_date?: string;
  is_approved: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  can_be_edited: boolean;
  can_supplier_respond: boolean;
  created_at: string;
  updated_at: string;
}

// Dispute types
export interface Dispute {
  id: number;
  dispute_number: string;
  raised_by: {
    id: number;
    name: string;
    business_name?: string;
  };
  against: {
    id: number;
    name: string;
    business_name?: string;
  };
  order?: {
    id: number;
    order_number: string;
  };
  title: string;
  description: string;
  description_hindi?: string;
  category: string;
  severity: string;
  severity_color: string;
  status: string;
  status_display: string;
  priority: string;
  resolution_notes?: string;
  resolution_date?: string;
  resolved_by?: {
    id: number;
    name: string;
  };
  evidence_files: string[];
  photos: string[];
  last_updated: string;
  response_deadline?: string;
  is_public: boolean;
  public_notes?: string;
  can_be_updated: boolean;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  message_hindi?: string;
  type: string;
  category?: string;
  order?: {
    id: number;
    order_number: string;
  };
  product?: {
    id: number;
    name: string;
  };
  dispute?: {
    id: number;
    dispute_number: string;
  };
  review?: {
    id: number;
    rating: number;
  };
  is_sent: boolean;
  is_delivered: boolean;
  is_read: boolean;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  delivery_attempts: number;
  max_attempts: number;
  priority: string;
  priority_color: string;
  scheduled_for?: string;
  metadata: Record<string, any>;
  delivery_status: string;
  can_retry: boolean;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface PaginatedResponse<T> {
  [key: string]: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'vendor' | 'supplier';
  city: string;
  state: string;
  address: string;
  pincode: string;
  business_name?: string;
  business_type?: string;
  gst_number?: string;
}

export interface ProductForm {
  name: string;
  name_hindi?: string;
  description?: string;
  description_hindi?: string;
  price_per_unit: number;
  unit: string;
  min_order_quantity: number;
  bulk_discount: number;
  bulk_threshold: number;
  current_stock: number;
  is_available: boolean;
  category_id: number;
  quality_grade: string;
  is_organic: boolean;
  is_fssai_certified: boolean;
  image_url?: string;
}

export interface OrderForm {
  supplier_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
  delivery_instructions?: string;
  is_group_order?: boolean;
  group_order_id?: string;
}

export interface ReviewForm {
  reviewed_id: number;
  product_id?: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment?: string;
  comment_hindi?: string;
  quality_rating?: number;
  delivery_rating?: number;
  communication_rating?: number;
  value_rating?: number;
  is_verified_purchase?: boolean;
}

export interface DisputeForm {
  against_id: number;
  order_id?: number;
  title: string;
  description: string;
  description_hindi?: string;
  category: string;
  severity?: string;
  priority?: string;
  is_public?: boolean;
  evidence_files?: string[];
  photos?: string[];
}

// Filter types
export interface ProductFilters {
  category_id?: number;
  supplier_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  city?: string;
  min_rating?: number;
}

export interface SupplierFilters {
  city?: string;
  state?: string;
  min_rating?: number;
  search?: string;
  verified_only?: boolean;
}

// Analytics types
export interface SupplierAnalytics {
  orders: {
    total: number;
    recent: number;
    trend: number;
  };
  revenue: {
    total: number;
    recent: number;
    trend: number;
  };
  products: {
    total: number;
    active: number;
    popular: {
      product: Product;
      total_sold: number;
    }[];
  };
  reviews: {
    total: number;
    average_rating: number;
    recent: number;
  };
  disputes: {
    total: number;
    open: number;
    resolution_rate: number;
  };
  trust_score: number;
  trust_badge: string;
}

export interface PlatformStats {
  users: {
    total_vendors: number;
    total_suppliers: number;
    total_users: number;
  };
  products: {
    total_products: number;
  };
  orders: {
    total_orders: number;
    completed_orders: number;
    completion_rate: number;
  };
  reviews: {
    total_reviews: number;
  };
  quality: {
    average_supplier_rating: number;
  };
} 