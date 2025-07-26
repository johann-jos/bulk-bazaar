from app import db
from datetime import datetime

class Notification(db.Model):
    """Notification model for SMS/WhatsApp simulation and in-app notifications"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Notification recipient
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Notification content
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    message_hindi = db.Column(db.Text)  # Hindi message for regional support
    
    # Notification type
    type = db.Column(db.String(50), nullable=False)  # order_update, price_alert, dispute, review, system
    category = db.Column(db.String(50))  # sms, whatsapp, email, in_app
    
    # Related entities
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    dispute_id = db.Column(db.Integer, db.ForeignKey('disputes.id'))
    review_id = db.Column(db.Integer, db.ForeignKey('reviews.id'))
    
    # Delivery status
    is_sent = db.Column(db.Boolean, default=False)
    is_delivered = db.Column(db.Boolean, default=False)
    is_read = db.Column(db.Boolean, default=False)
    
    # Delivery details
    sent_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    read_at = db.Column(db.DateTime)
    
    # Delivery attempts
    delivery_attempts = db.Column(db.Integer, default=0)
    max_attempts = db.Column(db.Integer, default=3)
    
    # Priority and scheduling
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    scheduled_for = db.Column(db.DateTime)  # For scheduled notifications
    
    # Metadata
    meta_data = db.Column(db.JSON)  # Additional data like phone number, template_id, etc.
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', overlaps="notifications")
    order = db.relationship('Order', backref='notifications')
    product = db.relationship('Product', backref='notifications')
    dispute = db.relationship('Dispute', backref='notifications')
    review = db.relationship('Review', backref='notifications')
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        self.is_sent = True
        self.sent_at = datetime.utcnow()
        self.delivery_attempts += 1
    
    def mark_as_delivered(self):
        """Mark notification as delivered"""
        self.is_delivered = True
        self.delivered_at = datetime.utcnow()
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.is_read = True
        self.read_at = datetime.utcnow()
    
    def can_retry(self):
        """Check if notification can be retried"""
        return not self.is_delivered and self.delivery_attempts < self.max_attempts
    
    def is_overdue(self):
        """Check if scheduled notification is overdue"""
        if self.scheduled_for:
            return datetime.utcnow() > self.scheduled_for
        return False
    
    def get_delivery_status(self):
        """Get delivery status"""
        if self.is_delivered:
            return 'delivered'
        elif self.is_sent:
            return 'sent'
        elif self.delivery_attempts > 0:
            return 'failed'
        else:
            return 'pending'
    
    def get_priority_color(self):
        """Get color for priority level"""
        priority_colors = {
            'low': 'gray',
            'normal': 'blue',
            'high': 'orange',
            'urgent': 'red'
        }
        return priority_colors.get(self.priority, 'gray')
    
    def to_dict(self):
        """Convert notification to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'message_hindi': self.message_hindi,
            'type': self.type,
            'category': self.category,
            'order': {
                'id': self.order.id,
                'order_number': self.order.order_number
            } if self.order else None,
            'product': {
                'id': self.product.id,
                'name': self.product.name
            } if self.product else None,
            'dispute': {
                'id': self.dispute.id,
                'dispute_number': self.dispute.dispute_number
            } if self.dispute else None,
            'review': {
                'id': self.review.id,
                'rating': self.review.rating
            } if self.review else None,
            'is_sent': self.is_sent,
            'is_delivered': self.is_delivered,
            'is_read': self.is_read,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'delivery_attempts': self.delivery_attempts,
            'max_attempts': self.max_attempts,
            'priority': self.priority,
            'priority_color': self.get_priority_color(),
            'scheduled_for': self.scheduled_for.isoformat() if self.scheduled_for else None,
            'metadata': self.meta_data or {},
            'delivery_status': self.get_delivery_status(),
            'can_retry': self.can_retry(),
            'is_overdue': self.is_overdue(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Notification {self.type}: {self.title}>' 