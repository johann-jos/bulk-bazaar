from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def auth_root():
    """Auth API root endpoint"""
    return jsonify({
        'message': 'SahiSauda Auth API',
        'endpoints': {
            'register': '/register',
            'login': '/login',
            'profile': '/profile',
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (template)"""
    # TODO: Implement registration logic
    return jsonify({'message': 'Register endpoint (template)'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user with email and password"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # For demo purposes, hardcoded credentials
    # In a real app, you would validate against database
    demo_users = {
        'vendor1@test.com': {
            'password': 'password123',
            'user': {'id': 1, 'name': 'Demo Vendor', 'email': 'vendor1@test.com', 'role': 'vendor'}
        },
        'supplier1@test.com': {
            'password': 'password123',
            'user': {'id': 2, 'name': 'Demo Supplier', 'email': 'supplier1@test.com', 'role': 'supplier'}
        }
    }
    
    user_email = data.get('email')
    user_record = demo_users.get(user_email)
    
    if not user_record or user_record['password'] != data.get('password'):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=user_record['user']['id'])
    
    return jsonify({
        'access_token': access_token,
        'user': user_record['user']
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile (template)"""
    # TODO: Implement profile retrieval
    return jsonify({'message': 'Profile endpoint (template)'}), 200