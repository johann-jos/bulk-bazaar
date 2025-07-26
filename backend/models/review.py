from app import db
from datetime import datetime

class Review(db.Model):
    """Review model for vendor-supplier ratings and feedback"""
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Review parties
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Vendor who wrote review
    reviewed_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Supplier being reviewed
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))  # Optional: specific product review
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))  # Optional: order reference
    
    # Review content
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    title = db.Column(db.String(100))
    comment = db.Column(db.Text)
    comment_hindi = db.Column(db.Text)  # Hindi comment for regional support
    
    # Review categories
    quality_rating = db.Column(db.Integer)  # Product quality (1-5)
    delivery_rating = db.Column(db.Integer)  # Delivery service (1-5)
    communication_rating = db.Column(db.Integer)  # Communication (1-5)
    value_rating = db.Column(db.Integer)  # Value for money (1-5)
    
    # Review metadata
    is_verified_purchase = db.Column(db.Boolean, default=False)
    is_helpful = db.Column(db.Boolean, default=False)
    helpful_count = db.Column(db.Integer, default=0)
    
    # Supplier response
    supplier_response = db.Column(db.Text)
    supplier_response_hindi = db.Column(db.Text)
    response_date = db.Column(db.DateTime)
    
    # Moderation
    is_approved = db.Column(db.Boolean, default=True)
    is_flagged = db.Column(db.Boolean, default=False)
    flag_reason = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_overall_rating(self):
        """Calculate overall rating from category ratings"""
        ratings = [r for r in [self.quality_rating, self.delivery_rating, 
                              self.communication_rating, self.value_rating] if r is not None]
        if ratings:
            return sum(ratings) / len(ratings)
        return self.rating
    
    def get_rating_stars(self):
        """Get star representation of rating"""
        return '★' * int(self.rating) + '☆' * (5 - int(self.rating))
    
    def can_be_edited(self):
        """Check if review can be edited (within 7 days)"""
        if not self.created_at:
            return False
        days_since_creation = (datetime.utcnow() - self.created_at).days
        return days_since_creation <= 7
    
    def can_supplier_respond(self):
        """Check if supplier can respond to this review"""
        return not self.supplier_response and self.is_approved
    
    def mark_helpful(self):
        """Mark review as helpful"""
        self.helpful_count += 1
        if self.helpful_count >= 3:
            self.is_helpful = True
    
    def to_dict(self):
        """Convert review to dictionary"""
        return {
            'id': self.id,
            'reviewer': {
                'id': self.reviewer.id,
                'name': self.reviewer.name,
                'business_name': self.reviewer.business_name
            } if self.reviewer else None,
            'reviewed': {
                'id': self.reviewed.id,
                'name': self.reviewed.name,
                'business_name': self.reviewed.business_name
            } if self.reviewed else None,
            'product': self.product.to_dict() if self.product else None,
            'order': {
                'id': self.order.id,
                'order_number': self.order.order_number
            } if self.order else None,
            'rating': self.rating,
            'overall_rating': round(self.get_overall_rating(), 2),
            'rating_stars': self.get_rating_stars(),
            'title': self.title,
            'comment': self.comment,
            'comment_hindi': self.comment_hindi,
            'quality_rating': self.quality_rating,
            'delivery_rating': self.delivery_rating,
            'communication_rating': self.communication_rating,
            'value_rating': self.value_rating,
            'is_verified_purchase': self.is_verified_purchase,
            'is_helpful': self.is_helpful,
            'helpful_count': self.helpful_count,
            'supplier_response': self.supplier_response,
            'supplier_response_hindi': self.supplier_response_hindi,
            'response_date': self.response_date.isoformat() if self.response_date else None,
            'is_approved': self.is_approved,
            'is_flagged': self.is_flagged,
            'flag_reason': self.flag_reason,
            'can_be_edited': self.can_be_edited(),
            'can_supplier_respond': self.can_supplier_respond(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Review {self.rating}★ by {self.reviewer.name if self.reviewer else "Unknown"}>' 