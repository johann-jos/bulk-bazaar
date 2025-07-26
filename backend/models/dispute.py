from app import db
from datetime import datetime

class Dispute(db.Model):
    """Dispute model for handling vendor complaints and issues"""
    __tablename__ = 'disputes'
    
    id = db.Column(db.Integer, primary_key=True)
    dispute_number = db.Column(db.String(20), unique=True, nullable=False)
    
    # Dispute parties
    raised_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Vendor who raised dispute
    against_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Supplier against whom dispute is raised
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))  # Related order
    
    # Dispute details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    description_hindi = db.Column(db.Text)  # Hindi description
    
    # Dispute categories
    category = db.Column(db.String(50), nullable=False)  # quality, delivery, payment, communication, other
    severity = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    
    # Status tracking
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved, closed, escalated
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    
    # Resolution details
    resolution_notes = db.Column(db.Text)
    resolution_date = db.Column(db.DateTime)
    resolved_by_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Admin who resolved
    
    # Evidence and documentation
    evidence_files = db.Column(db.JSON)  # List of file paths
    photos = db.Column(db.JSON)  # List of photo URLs
    
    # Communication
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    response_deadline = db.Column(db.DateTime)
    
    # Public visibility
    is_public = db.Column(db.Boolean, default=False)  # Whether dispute is visible to other users
    public_notes = db.Column(db.Text)  # Public notes for transparency
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    raised_by = db.relationship('User', foreign_keys=[raised_by_id], overlaps="disputes_raised")
    against = db.relationship('User', foreign_keys=[against_id], overlaps="disputes_against")
    order = db.relationship('Order', backref='disputes')
    resolved_by = db.relationship('User', foreign_keys=[resolved_by_id])
    
    def __init__(self, **kwargs):
        super(Dispute, self).__init__(**kwargs)
        if not self.dispute_number:
            self.dispute_number = self._generate_dispute_number()
    
    def _generate_dispute_number(self):
        """Generate unique dispute number"""
        import random
        import string
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"DP{timestamp}{random_chars}"
    
    def get_status_display(self):
        """Get human-readable status"""
        status_map = {
            'open': 'Open',
            'in_progress': 'In Progress',
            'resolved': 'Resolved',
            'closed': 'Closed',
            'escalated': 'Escalated'
        }
        return status_map.get(self.status, self.status)
    
    def get_severity_color(self):
        """Get color for severity level"""
        severity_colors = {
            'low': 'green',
            'medium': 'orange',
            'high': 'red',
            'critical': 'darkred'
        }
        return severity_colors.get(self.severity, 'gray')
    
    def can_be_updated(self):
        """Check if dispute can be updated"""
        return self.status in ['open', 'in_progress']
    
    def is_overdue(self):
        """Check if dispute response is overdue"""
        if self.response_deadline:
            return datetime.utcnow() > self.response_deadline
        return False
    
    def escalate(self):
        """Escalate dispute to higher priority"""
        if self.priority == 'low':
            self.priority = 'normal'
        elif self.priority == 'normal':
            self.priority = 'high'
        elif self.priority == 'high':
            self.priority = 'urgent'
            self.severity = 'critical'
        self.status = 'escalated'
    
    def resolve(self, resolution_notes, resolved_by_id):
        """Resolve the dispute"""
        self.status = 'resolved'
        self.resolution_notes = resolution_notes
        self.resolved_by_id = resolved_by_id
        self.resolution_date = datetime.utcnow()
    
    def to_dict(self):
        """Convert dispute to dictionary"""
        return {
            'id': self.id,
            'dispute_number': self.dispute_number,
            'raised_by': {
                'id': self.raised_by.id,
                'name': self.raised_by.name,
                'business_name': self.raised_by.business_name
            } if self.raised_by else None,
            'against': {
                'id': self.against.id,
                'name': self.against.name,
                'business_name': self.against.business_name
            } if self.against else None,
            'order': {
                'id': self.order.id,
                'order_number': self.order.order_number
            } if self.order else None,
            'title': self.title,
            'description': self.description,
            'description_hindi': self.description_hindi,
            'category': self.category,
            'severity': self.severity,
            'severity_color': self.get_severity_color(),
            'status': self.status,
            'status_display': self.get_status_display(),
            'priority': self.priority,
            'resolution_notes': self.resolution_notes,
            'resolution_date': self.resolution_date.isoformat() if self.resolution_date else None,
            'resolved_by': {
                'id': self.resolved_by.id,
                'name': self.resolved_by.name
            } if self.resolved_by else None,
            'evidence_files': self.evidence_files or [],
            'photos': self.photos or [],
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'response_deadline': self.response_deadline.isoformat() if self.response_deadline else None,
            'is_public': self.is_public,
            'public_notes': self.public_notes,
            'can_be_updated': self.can_be_updated(),
            'is_overdue': self.is_overdue(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Dispute {self.dispute_number}: {self.title}>' 