from app import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename

class Category(db.Model):
    """Product category model"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    name_hindi = db.Column(db.String(50))  # Hindi name for regional support
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))  # Icon name for UI
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'name_hindi': self.name_hindi,
            'description': self.description,
            'icon': self.icon,
            'product_count': self.products.count()
        }

class Product(db.Model):
    """Product model for suppliers to list items"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_hindi = db.Column(db.String(100))  # Hindi name
    description = db.Column(db.Text)
    description_hindi = db.Column(db.Text)  # Hindi description
    
    # Images
    image_url = db.Column(db.String(255))
    additional_images = db.Column(db.JSON)  # Array of image URLs
    
    # Pricing
    price_per_unit = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  # kg, pieces, liters, etc.
    min_order_quantity = db.Column(db.Float, default=1.0)
    bulk_discount = db.Column(db.Float, default=0.0)  # Percentage discount for bulk orders
    bulk_threshold = db.Column(db.Float, default=0.0)  # Quantity threshold for bulk discount
    
    # Stock and availability
    current_stock = db.Column(db.Float, default=0.0)
    is_available = db.Column(db.Boolean, default=True)
    
    # Product details
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Quality and certification
    quality_grade = db.Column(db.String(20), default='standard')  # premium, standard, economy
    is_organic = db.Column(db.Boolean, default=False)
    is_fssai_certified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy='dynamic')
    reviews = db.relationship('Review', backref='product', lazy='dynamic')
    
    def get_discounted_price(self, quantity):
        """Get price with bulk discount applied"""
        if quantity >= self.bulk_threshold and self.bulk_discount > 0:
            discount = self.price_per_unit * (self.bulk_discount / 100)
            return self.price_per_unit - discount
        return self.price_per_unit
    
    def get_average_rating(self):
        """Get average rating from reviews"""
        reviews = self.reviews.all()
        if not reviews:
            return 0.0
        return sum(review.rating for review in reviews) / len(reviews)
    
    def get_total_sales(self):
        """Get total quantity sold"""
        return sum(item.quantity for item in self.order_items.all())
    
    def is_low_stock(self):
        """Check if product is low on stock"""
        return self.current_stock < (self.min_order_quantity * 2)
    
    def to_dict(self):
        """Convert product to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'name_hindi': self.name_hindi,
            'description': self.description,
            'description_hindi': self.description_hindi,
            'image_url': self.image_url,
            'additional_images': self.additional_images or [],
            'price_per_unit': self.price_per_unit,
            'unit': self.unit,
            'min_order_quantity': self.min_order_quantity,
            'bulk_discount': self.bulk_discount,
            'bulk_threshold': self.bulk_threshold,
            'current_stock': self.current_stock,
            'is_available': self.is_available,
            'category': self.category.to_dict() if self.category else None,
            'supplier': {
                'id': self.supplier.id,
                'name': self.supplier.name,
                'business_name': self.supplier.business_name,
                'trust_score': self.supplier.trust_score,
                'city': self.supplier.city
            } if self.supplier else None,
            'quality_grade': self.quality_grade,
            'is_organic': self.is_organic,
            'is_fssai_certified': self.is_fssai_certified,
            'average_rating': round(self.get_average_rating(), 2),
            'total_sales': self.get_total_sales(),
            'is_low_stock': self.is_low_stock(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Product {self.name}: {self.price_per_unit}/{self.unit}>' 