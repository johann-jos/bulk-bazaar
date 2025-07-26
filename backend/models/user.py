from app import db
from datetime import datetime
import bcrypt
import os
from werkzeug.utils import secure_filename

class User(db.Model):
    """User model for both vendors and suppliers"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'vendor' or 'supplier'
    
    # Profile image
    profile_image = db.Column(db.String(255))
    
    # Location fields
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    address = db.Column(db.Text, nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    
    # Business details
    business_name = db.Column(db.String(100))
    business_type = db.Column(db.String(50))
    gst_number = db.Column(db.String(15))
    
    # Verification and trust
    is_verified = db.Column(db.Boolean, default=False)
    trust_score = db.Column(db.Float, default=0.0)
    total_orders = db.Column(db.Integer, default=0)
    successful_orders = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='supplier', lazy='dynamic')
    orders_as_vendor = db.relationship('Order', foreign_keys='Order.vendor_id', backref='vendor', lazy='dynamic')
    orders_as_supplier = db.relationship('Order', foreign_keys='Order.supplier_id', backref='supplier', lazy='dynamic')
    reviews_given = db.relationship('Review', foreign_keys='Review.reviewer_id', backref='reviewer', lazy='dynamic')
    reviews_received = db.relationship('Review', foreign_keys='Review.reviewed_id', backref='reviewed', lazy='dynamic')
    disputes_raised = db.relationship('Dispute', foreign_keys='Dispute.raised_by_id', lazy='dynamic')
    disputes_against = db.relationship('Dispute', foreign_keys='Dispute.against_id', lazy='dynamic')
    notifications = db.relationship('Notification', lazy='dynamic')
    
    def __init__(self, email, password, name, phone, role, city, state, address, pincode, **kwargs):
        self.email = email
        self.password_hash = self._hash_password(password)
        self.name = name
        self.phone = phone
        self.role = role
        self.city = city
        self.state = state
        self.address = address
        self.pincode = pincode
        
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def _hash_password(self, password):
        """Hash password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def is_vendor(self):
        """Check if user is a vendor"""
        return self.role == 'vendor'
    
    def is_supplier(self):
        """Check if user is a supplier"""
        return self.role == 'supplier'
    
    def update_trust_score(self):
        """Update trust score based on successful orders and reviews"""
        if self.total_orders > 0:
            success_rate = self.successful_orders / self.total_orders
            avg_rating = self.get_average_rating()
            self.trust_score = (success_rate * 0.6) + (avg_rating * 0.4)
        else:
            self.trust_score = 0.0
    
    def get_average_rating(self):
        """Get average rating from reviews"""
        reviews = self.reviews_received.all()
        if not reviews:
            return 0.0
        return sum(review.rating for review in reviews) / len(reviews)
    
    def get_trust_badge(self):
        """Get trust badge based on trust score"""
        if self.trust_score >= 4.5:
            return 'gold'
        elif self.trust_score >= 4.0:
            return 'silver'
        elif self.trust_score >= 3.5:
            return 'bronze'
        else:
            return 'new'
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'role': self.role,
            'profile_image': self.profile_image,
            'city': self.city,
            'state': self.state,
            'address': self.address,
            'pincode': self.pincode,
            'business_name': self.business_name,
            'business_type': self.business_type,
            'gst_number': self.gst_number,
            'is_verified': self.is_verified,
            'trust_score': round(self.trust_score, 2),
            'trust_badge': self.get_trust_badge(),
            'total_orders': self.total_orders,
            'successful_orders': self.successful_orders,
            'average_rating': round(self.get_average_rating(), 2),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email}: {self.name}>' 