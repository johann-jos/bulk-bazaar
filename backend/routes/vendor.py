from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

vendor_bp = Blueprint('vendor', __name__)

@vendor_bp.route('/', methods=['GET'])
def vendor_root():
    """Vendor API root endpoint"""
    return jsonify({
        'message': 'SahiSauda Vendor API',
        'endpoints': {
            'suppliers': '/suppliers',
            'orders': '/orders',
            'reviews': '/reviews',
            'disputes': '/disputes'
        }
    }), 200

@vendor_bp.route('/suppliers', methods=['GET'])
@jwt_required()
def get_suppliers():
    """Get list of suppliers (template)"""
    # TODO: Implement supplier listing
    return jsonify({'message': 'Vendor suppliers endpoint (template)'}), 200

@vendor_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():
    """Place a new order (template)"""
    # TODO: Implement order placement
    return jsonify({'message': 'Vendor place order endpoint (template)'}), 201