from app import db
from datetime import datetime

class Order(db.Model):
    """Order model for vendor purchases"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    
    # Order parties
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Order details
    total_amount = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    discount_amount = db.Column(db.Float, default=0.0)
    final_amount = db.Column(db.Float, nullable=False)
    
    # Delivery information
    delivery_address = db.Column(db.Text, nullable=False)
    delivery_city = db.Column(db.String(50), nullable=False)
    delivery_pincode = db.Column(db.String(10), nullable=False)
    delivery_instructions = db.Column(db.Text)
    
    # Order status
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, processing, shipped, delivered, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed, refunded
    
    # Delivery details
    expected_delivery_date = db.Column(db.Date)
    actual_delivery_date = db.Column(db.Date)
    delivery_notes = db.Column(db.Text)
    
    # Group order details
    is_group_order = db.Column(db.Boolean, default=False)
    group_order_id = db.Column(db.String(20))  # For linking multiple orders
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super(Order, self).__init__(**kwargs)
        if not self.order_number:
            self.order_number = self._generate_order_number()
    
    def _generate_order_number(self):
        """Generate unique order number"""
        import random
        import string
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"SS{timestamp}{random_chars}"
    
    def calculate_totals(self):
        """Calculate order totals"""
        subtotal = sum(item.total_price for item in self.items.all())
        self.total_amount = subtotal
        self.final_amount = subtotal + self.delivery_fee + self.tax_amount - self.discount_amount
    
    def get_status_display(self):
        """Get human-readable status"""
        status_map = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        return status_map.get(self.status, self.status)
    
    def can_be_cancelled(self):
        """Check if order can be cancelled"""
        return self.status in ['pending', 'confirmed']
    
    def can_be_modified(self):
        """Check if order can be modified"""
        return self.status in ['pending']
    
    def get_delivery_status(self):
        """Get delivery status for tracking"""
        if self.status == 'delivered':
            return 'Delivered'
        elif self.status == 'shipped':
            return 'In Transit'
        elif self.status in ['confirmed', 'processing']:
            return 'Preparing'
        else:
            return 'Pending'
    
    def to_dict(self):
        """Convert order to dictionary"""
        return {
            'id': self.id,
            'order_number': self.order_number,
            'vendor': {
                'id': self.vendor.id,
                'name': self.vendor.name,
                'business_name': self.vendor.business_name
            } if self.vendor else None,
            'supplier': {
                'id': self.supplier.id,
                'name': self.supplier.name,
                'business_name': self.supplier.business_name
            } if self.supplier else None,
            'total_amount': self.total_amount,
            'delivery_fee': self.delivery_fee,
            'tax_amount': self.tax_amount,
            'discount_amount': self.discount_amount,
            'final_amount': self.final_amount,
            'delivery_address': self.delivery_address,
            'delivery_city': self.delivery_city,
            'delivery_pincode': self.delivery_pincode,
            'delivery_instructions': self.delivery_instructions,
            'status': self.status,
            'status_display': self.get_status_display(),
            'payment_status': self.payment_status,
            'expected_delivery_date': self.expected_delivery_date.isoformat() if self.expected_delivery_date else None,
            'actual_delivery_date': self.actual_delivery_date.isoformat() if self.actual_delivery_date else None,
            'delivery_notes': self.delivery_notes,
            'is_group_order': self.is_group_order,
            'group_order_id': self.group_order_id,
            'items': [item.to_dict() for item in self.items.all()],
            'can_be_cancelled': self.can_be_cancelled(),
            'can_be_modified': self.can_be_modified(),
            'delivery_status': self.get_delivery_status(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Order {self.order_number}>'

class OrderItem(db.Model):
    """Order item model for individual products in orders"""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Item details
    quantity = db.Column(db.Float, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    
    # Quality check
    quality_rating = db.Column(db.Integer)  # 1-5 rating for received quality
    quality_notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def calculate_total(self):
        """Calculate total price for this item"""
        self.total_price = self.quantity * self.unit_price
    
    def to_dict(self):
        """Convert order item to dictionary"""
        return {
            'id': self.id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'quality_rating': self.quality_rating,
            'quality_notes': self.quality_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<OrderItem {self.product.name if self.product else "Unknown"} x {self.quantity}>' 