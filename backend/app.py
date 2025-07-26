from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from config import config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'https://sahisauda.vercel.app'])
    
    # Import models after db.init_app(app) to avoid circular imports
    with app.app_context():
        from models.user import User
        from models.product import Product, Category
        from models.order import Order, OrderItem
        from models.review import Review
        from models.dispute import Dispute
        from models.notification import Notification
    
    # Ensure UPLOAD_FOLDER is set
    if not app.config.get('UPLOAD_FOLDER'):
        app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.vendor import vendor_bp
    from routes.supplier import supplier_bp
    from routes.common import common_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vendor_bp, url_prefix='/api/vendor')
    app.register_blueprint(supplier_bp, url_prefix='/api/supplier')
    app.register_blueprint(common_bp, url_prefix='/api/common')
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'SahiSauda API is running'}
    
    # Root endpoint
    @app.route('/')
    def root():
        return {
            'message': 'SahiSauda API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'auth': '/api/auth',
                'vendor': '/api/vendor',
                'supplier': '/api/supplier',
                'common': '/api/common'
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)