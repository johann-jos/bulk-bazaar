from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.user import User
from models.product import Product, Category
from models.review import Review
from models.dispute import Dispute
from models.notification import Notification
from models.order import Order
from datetime import datetime, timedelta
from sqlalchemy import and_, or_, desc, func

common_bp = Blueprint('common', __name__)

@common_bp.route('/', methods=['GET'])
def common_root():
    """Common API root endpoint"""
    return jsonify({
        'message': 'SahiSauda Common API',
        'endpoints': {
            'categories': '/categories',
            'products': '/products',
            'suppliers': '/suppliers',
            'notifications': '/notifications',
            'stats': '/stats'
        }
    }), 200

@common_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories (template)"""
    # TODO: Implement category listing
    return jsonify({'message': 'Categories endpoint (template)'}), 200

@common_bp.route('/products', methods=['GET'])
def search_products_public():
    """Public product search"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        supplier_id = request.args.get('supplier_id', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        search = request.args.get('search')
        city = request.args.get('city')
        min_rating = request.args.get('min_rating', type=float)
        
        # Build query
        query = Product.query.filter_by(is_available=True).join(User)
        
        # Apply filters
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if supplier_id:
            query = query.filter(Product.supplier_id == supplier_id)
        if min_price:
            query = query.filter(Product.price_per_unit >= min_price)
        if max_price:
            query = query.filter(Product.price_per_unit <= max_price)
        if search:
            search_filter = or_(
                Product.name.ilike(f'%{search}%'),
                Product.name_hindi.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        if city:
            query = query.filter(User.city.ilike(f'%{city}%'))
        if min_rating:
            # Filter by supplier rating
            query = query.filter(User.trust_score >= min_rating)
        
        # Order by price
        query = query.order_by(Product.price_per_unit)
        
        # Paginate
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    """Get product details"""
    try:
        product = Product.query.filter_by(id=product_id, is_available=True).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get product reviews
        reviews = Review.query.filter_by(product_id=product_id).order_by(desc(Review.created_at)).limit(5).all()
        
        return jsonify({
            'product': product.to_dict(),
            'reviews': [review.to_dict() for review in reviews]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/suppliers', methods=['GET'])
def get_suppliers_public():
    """Public supplier directory"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        city = request.args.get('city')
        state = request.args.get('state')
        min_rating = request.args.get('min_rating', type=float)
        search = request.args.get('search')
        verified_only = request.args.get('verified_only', 'false').lower() == 'true'
        
        # Build query
        query = User.query.filter_by(role='supplier')
        
        # Apply filters
        if city:
            query = query.filter(User.city.ilike(f'%{city}%'))
        if state:
            query = query.filter(User.state.ilike(f'%{state}%'))
        if min_rating:
            query = query.filter(User.trust_score >= min_rating)
        if verified_only:
            query = query.filter(User.is_verified == True)
        if search:
            search_filter = or_(
                User.name.ilike(f'%{search}%'),
                User.business_name.ilike(f'%{search}%'),
                User.city.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # Order by trust score
        query = query.order_by(desc(User.trust_score))
        
        # Paginate
        suppliers = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'suppliers': [supplier.to_dict() for supplier in suppliers.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': suppliers.total,
                'pages': suppliers.pages,
                'has_next': suppliers.has_next,
                'has_prev': suppliers.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier_detail_public(supplier_id):
    """Get public supplier details"""
    try:
        supplier = User.query.filter_by(id=supplier_id, role='supplier').first()
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        
        # Get supplier's products
        products = Product.query.filter_by(supplier_id=supplier_id, is_available=True).all()
        
        # Get recent reviews
        reviews = Review.query.filter_by(reviewed_id=supplier_id).order_by(desc(Review.created_at)).limit(10).all()
        
        # Get supplier stats
        total_products = len(products)
        avg_rating = supplier.get_average_rating()
        
        return jsonify({
            'supplier': supplier.to_dict(),
            'products': [product.to_dict() for product in products],
            'reviews': [review.to_dict() for review in reviews],
            'stats': {
                'total_products': total_products,
                'average_rating': round(avg_rating, 2),
                'total_orders': supplier.total_orders,
                'successful_orders': supplier.successful_orders
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/disputes', methods=['GET'])
def get_public_disputes():
    """Get public disputes for transparency"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        supplier_id = request.args.get('supplier_id', type=int)
        status = request.args.get('status')
        
        # Build query
        query = Dispute.query.filter_by(is_public=True)
        
        if supplier_id:
            query = query.filter(Dispute.against_id == supplier_id)
        if status:
            query = query.filter(Dispute.status == status)
        
        # Order by creation date
        query = query.order_by(desc(Dispute.created_at))
        
        # Paginate
        disputes = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'disputes': [dispute.to_dict() for dispute in disputes.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': disputes.total,
                'pages': disputes.pages,
                'has_next': disputes.has_next,
                'has_prev': disputes.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user notifications"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        # Build query
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        # Order by creation date
        query = query.order_by(desc(Notification.created_at))
        
        # Paginate
        notifications = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'notifications': [notification.to_dict() for notification in notifications.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': notifications.total,
                'pages': notifications.pages,
                'has_next': notifications.has_next,
                'has_prev': notifications.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/notifications/<int:notification_id>/read', methods=['POST'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id, user_id=user_id
        ).first()
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        notification.mark_as_read()
        db.session.commit()
        
        return jsonify({
            'message': 'Notification marked as read'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@common_bp.route('/notifications/read-all', methods=['POST'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read"""
    try:
        user_id = get_jwt_identity()
        
        notifications = Notification.query.filter_by(
            user_id=user_id, is_read=False
        ).all()
        
        for notification in notifications:
            notification.mark_as_read()
        
        db.session.commit()
        
        return jsonify({
            'message': f'Marked {len(notifications)} notifications as read'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@common_bp.route('/notify', methods=['POST'])
def simulate_notification():
    """Simulate SMS/WhatsApp notification (for demo purposes)"""
    try:
        data = request.get_json()
        
        if not data.get('phone') or not data.get('message'):
            return jsonify({'error': 'Phone and message are required'}), 400
        
        # Simulate notification sending
        notification_data = {
            'phone': data['phone'],
            'message': data['message'],
            'type': data.get('type', 'sms'),
            'timestamp': datetime.now().isoformat(),
            'status': 'sent'
        }
        
        # In a real implementation, this would integrate with Twilio or similar service
        print(f"📱 SIMULATED {data.get('type', 'sms').upper()}:")
        print(f"   To: {data['phone']}")
        print(f"   Message: {data['message']}")
        print(f"   Time: {notification_data['timestamp']}")
        print("   Status: ✅ Sent successfully")
        
        return jsonify({
            'message': 'Notification sent successfully (simulated)',
            'notification': notification_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/search', methods=['GET'])
def global_search():
    """Global search across products and suppliers"""
    try:
        search_term = request.args.get('q')
        if not search_term:
            return jsonify({'error': 'Search term is required'}), 400
        
        # Search products
        products = Product.query.filter(
            and_(
                Product.is_available == True,
                or_(
                    Product.name.ilike(f'%{search_term}%'),
                    Product.name_hindi.ilike(f'%{search_term}%'),
                    Product.description.ilike(f'%{search_term}%')
                )
            )
        ).limit(10).all()
        
        # Search suppliers
        suppliers = User.query.filter(
            and_(
                User.role == 'supplier',
                or_(
                    User.name.ilike(f'%{search_term}%'),
                    User.business_name.ilike(f'%{search_term}%'),
                    User.city.ilike(f'%{search_term}%')
                )
            )
        ).limit(10).all()
        
        return jsonify({
            'search_term': search_term,
            'products': [product.to_dict() for product in products],
            'suppliers': [supplier.to_dict() for supplier in suppliers],
            'total_results': len(products) + len(suppliers)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@common_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get platform statistics (template)"""
    # TODO: Implement stats logic
    return jsonify({'message': 'Stats endpoint (template)'}), 200