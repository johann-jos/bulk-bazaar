#!/usr/bin/env python3
"""
Seed fake data for SahiSauda marketplace
Run this script to populate the database with test data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from models.user import User
from models.product import Product, Category
from models.order import Order, OrderItem
from models.review import Review
from models.dispute import Dispute
from models.notification import Notification
from datetime import datetime, timedelta
import random
from sqlalchemy import text

def seed_categories():
    """Seed product categories"""
    categories_data = [
        {
            'name': 'Vegetables',
            'name_hindi': 'सब्जियां',
            'description': 'Fresh vegetables and greens',
            'icon': 'vegetables'
        },
        {
            'name': 'Fruits',
            'name_hindi': 'फल',
            'description': 'Fresh fruits and berries',
            'icon': 'fruits'
        },
        {
            'name': 'Grains & Pulses',
            'name_hindi': 'अनाज और दालें',
            'description': 'Rice, wheat, lentils, and other grains',
            'icon': 'grains'
        },
        {
            'name': 'Dairy & Eggs',
            'name_hindi': 'दूध और अंडे',
            'description': 'Milk, cheese, butter, and eggs',
            'icon': 'dairy'
        },
        {
            'name': 'Spices & Condiments',
            'name_hindi': 'मसाले और मसाला',
            'description': 'Spices, herbs, and condiments',
            'icon': 'spices'
        },
        {
            'name': 'Meat & Fish',
            'name_hindi': 'मांस और मछली',
            'description': 'Fresh meat, poultry, and fish',
            'icon': 'meat'
        },
        {
            'name': 'Bakery & Snacks',
            'name_hindi': 'बेकरी और स्नैक्स',
            'description': 'Bread, cookies, and snacks',
            'icon': 'bakery'
        },
        {
            'name': 'Beverages',
            'name_hindi': 'पेय पदार्थ',
            'description': 'Juices, tea, coffee, and other beverages',
            'icon': 'beverages'
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.session.add(category)
        categories.append(category)
    
    db.session.commit()
    print(f"✅ Created {len(categories)} categories")
    return categories

def seed_users():
    """Seed users (vendors and suppliers)"""
    users_data = [
        # Vendors
        {
            'email': 'vendor1@test.com',
            'password': 'password123',
            'name': 'Rajesh Kumar',
            'phone': '9876543210',
            'role': 'vendor',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'address': '123 Andheri West, Mumbai',
            'pincode': '400058',
            'business_name': 'Rajesh Food Corner',
            'business_type': 'Street Food',
            'gst_number': '27ABCDE1234F1Z5',
            'is_verified': True,
            'trust_score': 4.2,
            'total_orders': 150,
            'successful_orders': 145
        },
        {
            'email': 'vendor2@test.com',
            'password': 'password123',
            'name': 'Priya Sharma',
            'phone': '9876543211',
            'role': 'vendor',
            'city': 'Delhi',
            'state': 'Delhi',
            'address': '456 Connaught Place, Delhi',
            'pincode': '110001',
            'business_name': 'Priya\'s Kitchen',
            'business_type': 'Food Truck',
            'gst_number': '07ABCDE1234F1Z5',
            'is_verified': True,
            'trust_score': 4.5,
            'total_orders': 120,
            'successful_orders': 115
        },
        {
            'email': 'vendor3@test.com',
            'password': 'password123',
            'name': 'Amit Patel',
            'phone': '9876543212',
            'role': 'vendor',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'address': '789 Koramangala, Bangalore',
            'pincode': '560034',
            'business_name': 'Amit\'s Dhaba',
            'business_type': 'Restaurant',
            'gst_number': '29ABCDE1234F1Z5',
            'is_verified': True,
            'trust_score': 4.0,
            'total_orders': 200,
            'successful_orders': 195
        },
        # Suppliers
        {
            'email': 'supplier1@test.com',
            'password': 'password123',
            'name': 'Suresh Verma',
            'phone': '9876543213',
            'role': 'supplier',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'address': '321 Dadar East, Mumbai',
            'pincode': '400014',
            'business_name': 'Verma Fresh Produce',
            'business_type': 'Wholesale',
            'gst_number': '27ABCDE1234F1Z6',
            'is_verified': True,
            'trust_score': 4.3,
            'total_orders': 300,
            'successful_orders': 295
        },
        {
            'email': 'supplier2@test.com',
            'password': 'password123',
            'name': 'Lakshmi Devi',
            'phone': '9876543214',
            'role': 'supplier',
            'city': 'Delhi',
            'state': 'Delhi',
            'address': '654 Chandni Chowk, Delhi',
            'pincode': '110006',
            'business_name': 'Lakshmi Grocery Store',
            'business_type': 'Retail',
            'gst_number': '07ABCDE1234F1Z6',
            'is_verified': True,
            'trust_score': 4.7,
            'total_orders': 250,
            'successful_orders': 245
        },
        {
            'email': 'supplier3@test.com',
            'password': 'password123',
            'name': 'Krishna Reddy',
            'phone': '9876543215',
            'role': 'supplier',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'address': '987 Malleswaram, Bangalore',
            'pincode': '560003',
            'business_name': 'Reddy Organic Farms',
            'business_type': 'Farm',
            'gst_number': '29ABCDE1234F1Z6',
            'is_verified': True,
            'trust_score': 4.8,
            'total_orders': 180,
            'successful_orders': 175
        }
    ]
    
    users = []
    for user_data in users_data:
        user = User(**user_data)
        db.session.add(user)
        users.append(user)
    
    db.session.commit()
    print(f"✅ Created {len(users)} users (3 vendors, 3 suppliers)")
    return users

def seed_products(categories, users):
    """Seed products"""
    # Get suppliers (last 3 users)
    suppliers = users[3:]
    
    products_data = [
        # Vegetables
        {
            'name': 'Fresh Tomatoes',
            'name_hindi': 'टमाटर',
            'description': 'Fresh red tomatoes, perfect for cooking',
            'description_hindi': 'ताजे लाल टमाटर, खाना बनाने के लिए बिल्कुल सही',
            'price_per_unit': 40.0,
            'unit': 'kg',
            'min_order_quantity': 5.0,
            'bulk_discount': 10.0,
            'bulk_threshold': 20.0,
            'current_stock': 100.0,
            'is_available': True,
            'category_id': 1,
            'supplier_id': suppliers[0].id,
            'quality_grade': 'premium',
            'is_organic': True,
            'is_fssai_certified': True
        },
        {
            'name': 'Onions',
            'name_hindi': 'प्याज',
            'description': 'Fresh onions, essential for every kitchen',
            'description_hindi': 'ताजे प्याज, हर रसोई के लिए जरूरी',
            'price_per_unit': 25.0,
            'unit': 'kg',
            'min_order_quantity': 10.0,
            'bulk_discount': 15.0,
            'bulk_threshold': 50.0,
            'current_stock': 200.0,
            'is_available': True,
            'category_id': 1,
            'supplier_id': suppliers[0].id,
            'quality_grade': 'standard',
            'is_organic': False,
            'is_fssai_certified': True
        },
        {
            'name': 'Potatoes',
            'name_hindi': 'आलू',
            'description': 'Fresh potatoes, perfect for various dishes',
            'description_hindi': 'ताजे आलू, विभिन्न व्यंजनों के लिए बिल्कुल सही',
            'price_per_unit': 30.0,
            'unit': 'kg',
            'min_order_quantity': 5.0,
            'bulk_discount': 12.0,
            'bulk_threshold': 25.0,
            'current_stock': 150.0,
            'is_available': True,
            'category_id': 1,
            'supplier_id': suppliers[1].id,
            'quality_grade': 'standard',
            'is_organic': False,
            'is_fssai_certified': True
        },
        # Fruits
        {
            'name': 'Bananas',
            'name_hindi': 'केले',
            'description': 'Sweet and ripe bananas',
            'description_hindi': 'मीठे और पके केले',
            'price_per_unit': 60.0,
            'unit': 'dozen',
            'min_order_quantity': 2.0,
            'bulk_discount': 8.0,
            'bulk_threshold': 10.0,
            'current_stock': 50.0,
            'is_available': True,
            'category_id': 2,
            'supplier_id': suppliers[2].id,
            'quality_grade': 'premium',
            'is_organic': True,
            'is_fssai_certified': True
        },
        {
            'name': 'Apples',
            'name_hindi': 'सेब',
            'description': 'Fresh red apples, imported',
            'description_hindi': 'ताजे लाल सेब, आयातित',
            'price_per_unit': 120.0,
            'unit': 'kg',
            'min_order_quantity': 2.0,
            'bulk_discount': 5.0,
            'bulk_threshold': 10.0,
            'current_stock': 30.0,
            'is_available': True,
            'category_id': 2,
            'supplier_id': suppliers[1].id,
            'quality_grade': 'premium',
            'is_organic': False,
            'is_fssai_certified': True
        },
        # Grains & Pulses
        {
            'name': 'Basmati Rice',
            'name_hindi': 'बासमती चावल',
            'description': 'Premium quality basmati rice',
            'description_hindi': 'प्रीमियम क्वालिटी बासमती चावल',
            'price_per_unit': 80.0,
            'unit': 'kg',
            'min_order_quantity': 5.0,
            'bulk_discount': 20.0,
            'bulk_threshold': 25.0,
            'current_stock': 100.0,
            'is_available': True,
            'category_id': 3,
            'supplier_id': suppliers[0].id,
            'quality_grade': 'premium',
            'is_organic': True,
            'is_fssai_certified': True
        },
        {
            'name': 'Toor Dal',
            'name_hindi': 'तूर दाल',
            'description': 'Fresh toor dal, perfect for sambar',
            'description_hindi': 'ताजी तूर दाल, सांभर के लिए बिल्कुल सही',
            'price_per_unit': 90.0,
            'unit': 'kg',
            'min_order_quantity': 2.0,
            'bulk_discount': 10.0,
            'bulk_threshold': 10.0,
            'current_stock': 75.0,
            'is_available': True,
            'category_id': 3,
            'supplier_id': suppliers[1].id,
            'quality_grade': 'standard',
            'is_organic': False,
            'is_fssai_certified': True
        },
        # Dairy & Eggs
        {
            'name': 'Fresh Milk',
            'name_hindi': 'ताजा दूध',
            'description': 'Pure cow milk, delivered daily',
            'description_hindi': 'शुद्ध गाय का दूध, रोज डिलीवरी',
            'price_per_unit': 60.0,
            'unit': 'liter',
            'min_order_quantity': 5.0,
            'bulk_discount': 5.0,
            'bulk_threshold': 20.0,
            'current_stock': 50.0,
            'is_available': True,
            'category_id': 4,
            'supplier_id': suppliers[2].id,
            'quality_grade': 'premium',
            'is_organic': True,
            'is_fssai_certified': True
        },
        {
            'name': 'Fresh Eggs',
            'name_hindi': 'ताजे अंडे',
            'description': 'Farm fresh eggs, 30 pieces per tray',
            'description_hindi': 'फार्म फ्रेश अंडे, 30 टुकड़े प्रति ट्रे',
            'price_per_unit': 120.0,
            'unit': 'tray',
            'min_order_quantity': 1.0,
            'bulk_discount': 8.0,
            'bulk_threshold': 5.0,
            'current_stock': 20.0,
            'is_available': True,
            'category_id': 4,
            'supplier_id': suppliers[2].id,
            'quality_grade': 'standard',
            'is_organic': False,
            'is_fssai_certified': True
        },
        # Spices & Condiments
        {
            'name': 'Turmeric Powder',
            'name_hindi': 'हल्दी पाउडर',
            'description': 'Pure turmeric powder, organic',
            'description_hindi': 'शुद्ध हल्दी पाउडर, जैविक',
            'price_per_unit': 200.0,
            'unit': 'kg',
            'min_order_quantity': 1.0,
            'bulk_discount': 15.0,
            'bulk_threshold': 5.0,
            'current_stock': 25.0,
            'is_available': True,
            'category_id': 5,
            'supplier_id': suppliers[0].id,
            'quality_grade': 'premium',
            'is_organic': True,
            'is_fssai_certified': True
        }
    ]
    
    products = []
    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)
        products.append(product)
    
    db.session.commit()
    print(f"✅ Created {len(products)} products")
    return products

def seed_orders(vendors, suppliers, products):
    """Seed sample orders"""
    orders_data = [
        {
            'vendor_id': vendors[0].id,
            'supplier_id': suppliers[0].id,
            'status': 'delivered',
            'created_at': datetime.now() - timedelta(days=5),
            'items': [
                {'product_id': 1, 'quantity': 10.0, 'unit_price': 40.0},
                {'product_id': 2, 'quantity': 20.0, 'unit_price': 25.0}
            ]
        },
        {
            'vendor_id': vendors[1].id,
            'supplier_id': suppliers[1].id,
            'status': 'delivered',
            'created_at': datetime.now() - timedelta(days=3),
            'items': [
                {'product_id': 3, 'quantity': 15.0, 'unit_price': 30.0},
                {'product_id': 5, 'quantity': 5.0, 'unit_price': 120.0}
            ]
        },
        {
            'vendor_id': vendors[2].id,
            'supplier_id': suppliers[2].id,
            'status': 'processing',
            'created_at': datetime.now() - timedelta(days=1),
            'items': [
                {'product_id': 4, 'quantity': 3.0, 'unit_price': 60.0},
                {'product_id': 8, 'quantity': 10.0, 'unit_price': 60.0}
            ]
        },
        {
            'vendor_id': vendors[0].id,
            'supplier_id': suppliers[1].id,
            'status': 'confirmed',
            'created_at': datetime.now() - timedelta(hours=6),
            'items': [
                {'product_id': 6, 'quantity': 10.0, 'unit_price': 80.0},
                {'product_id': 7, 'quantity': 5.0, 'unit_price': 90.0}
            ]
        },
        {
            'vendor_id': vendors[1].id,
            'supplier_id': suppliers[0].id,
            'status': 'pending',
            'created_at': datetime.now() - timedelta(hours=2),
            'items': [
                {'product_id': 9, 'quantity': 2.0, 'unit_price': 120.0},
                {'product_id': 10, 'quantity': 2.0, 'unit_price': 200.0}
            ]
        }
    ]
    
    orders = []
    for order_data in orders_data:
        # Create order
        order = Order(
            vendor_id=order_data['vendor_id'],
            supplier_id=order_data['supplier_id'],
            delivery_address='Sample delivery address',
            delivery_city='Sample City',
            delivery_pincode='123456',
            status=order_data['status'],
            created_at=order_data['created_at'],
            delivery_fee=0.0,
            tax_amount=0.0,
            discount_amount=0.0,
            total_amount=0.0,
            final_amount=0.0
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Add order items
        total_amount = 0.0
        for item_data in order_data['items']:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['quantity'] * item_data['unit_price']
            )
            db.session.add(order_item)
            total_amount += order_item.total_price
        
        # Set order totals
        order.total_amount = float(total_amount)
        order.final_amount = float(total_amount)
        
        orders.append(order)
    
    db.session.commit()
    print(f"✅ Created {len(orders)} orders")
    return orders

def seed_reviews(vendors, suppliers, products, orders):
    """Seed sample reviews"""
    reviews_data = [
        {
            'reviewer_id': vendors[0].id,
            'reviewed_id': suppliers[0].id,
            'product_id': 1,
            'order_id': 1,
            'rating': 5,
            'title': 'Excellent Quality Tomatoes',
            'comment': 'Very fresh and good quality tomatoes. Will order again!',
            'comment_hindi': 'बहुत ताजे और अच्छी क्वालिटी के टमाटर। फिर से ऑर्डर करूंगा!',
            'quality_rating': 5,
            'delivery_rating': 4,
            'communication_rating': 5,
            'value_rating': 4
        },
        {
            'reviewer_id': vendors[1].id,
            'reviewed_id': suppliers[1].id,
            'product_id': 3,
            'order_id': 2,
            'rating': 4,
            'title': 'Good Potatoes',
            'comment': 'Potatoes were fresh and delivered on time.',
            'comment_hindi': 'आलू ताजे थे और समय पर डिलीवर किए गए।',
            'quality_rating': 4,
            'delivery_rating': 5,
            'communication_rating': 4,
            'value_rating': 4
        },
        {
            'reviewer_id': vendors[2].id,
            'reviewed_id': suppliers[2].id,
            'product_id': 4,
            'order_id': 3,
            'rating': 5,
            'title': 'Perfect Bananas',
            'comment': 'Sweet and perfectly ripe bananas. Highly recommended!',
            'comment_hindi': 'मीठे और बिल्कुल पके केले। अत्यधिक अनुशंसित!',
            'quality_rating': 5,
            'delivery_rating': 5,
            'communication_rating': 5,
            'value_rating': 5
        }
    ]
    
    reviews = []
    for review_data in reviews_data:
        review = Review(**review_data)
        db.session.add(review)
        reviews.append(review)
    
    db.session.commit()
    print(f"✅ Created {len(reviews)} reviews")
    return reviews

def seed_disputes(vendors, suppliers):
    """Seed sample disputes"""
    disputes_data = [
        {
            'raised_by_id': vendors[0].id,
            'against_id': suppliers[1].id,
            'title': 'Late Delivery Issue',
            'description': 'Order was delivered 2 days late',
            'description_hindi': 'ऑर्डर 2 दिन देरी से डिलीवर किया गया',
            'category': 'delivery',
            'severity': 'medium',
            'status': 'resolved',
            'priority': 'normal'
        },
        {
            'raised_by_id': vendors[1].id,
            'against_id': suppliers[0].id,
            'title': 'Quality Issue with Rice',
            'description': 'Rice quality was not as expected',
            'description_hindi': 'चावल की क्वालिटी उम्मीद के अनुसार नहीं थी',
            'category': 'quality',
            'severity': 'high',
            'status': 'in_progress',
            'priority': 'high'
        }
    ]
    
    disputes = []
    for dispute_data in disputes_data:
        dispute = Dispute(**dispute_data)
        db.session.add(dispute)
        disputes.append(dispute)
    
    db.session.commit()
    print(f"✅ Created {len(disputes)} disputes")
    return disputes

def seed_notifications(users):
    """Seed sample notifications"""
    notifications_data = [
        {
            'user_id': users[0].id,
            'title': 'New Order Received',
            'message': 'You have received a new order from Rajesh Kumar',
            'message_hindi': 'आपको राजेश कुमार से नया ऑर्डर मिला है',
            'type': 'order_update',
            'category': 'in_app',
            'is_sent': True,
            'is_delivered': True
        },
        {
            'user_id': users[3].id,
            'title': 'Order Status Updated',
            'message': 'Your order has been shipped',
            'message_hindi': 'आपका ऑर्डर शिप कर दिया गया है',
            'type': 'order_update',
            'category': 'in_app',
            'is_sent': True,
            'is_delivered': True
        },
        {
            'user_id': users[1].id,
            'title': 'New Review Received',
            'message': 'You have received a new 5-star review',
            'message_hindi': 'आपको एक नई 5-स्टार रिव्यू मिली है',
            'type': 'review',
            'category': 'in_app',
            'is_sent': True,
            'is_delivered': True
        }
    ]
    
    notifications = []
    for notification_data in notifications_data:
        notification = Notification(**notification_data)
        db.session.add(notification)
        notifications.append(notification)
    
    db.session.commit()
    print(f"✅ Created {len(notifications)} notifications")
    return notifications

def main():
    """Main seeding function"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        # Clear existing data
        print("🗑️  Clearing existing data...")
        # Use SQL with CASCADE to handle dependencies
        db.session.execute(text('DROP SCHEMA public CASCADE'))
        db.session.execute(text('CREATE SCHEMA public'))
        db.session.commit()
        db.create_all()
        
        # Seed data
        categories = seed_categories()
        users = seed_users()
        products = seed_products(categories, users)
        orders = seed_orders(users[:3], users[3:], products)  # First 3 are vendors, rest are suppliers
        reviews = seed_reviews(users[:3], users[3:], products, orders)
        disputes = seed_disputes(users[:3], users[3:])
        notifications = seed_notifications(users)
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📊 Summary:")
        print(f"   Categories: {len(categories)}")
        print(f"   Users: {len(users)} (3 vendors, 3 suppliers)")
        print(f"   Products: {len(products)}")
        print(f"   Orders: {len(orders)}")
        print(f"   Reviews: {len(reviews)}")
        print(f"   Disputes: {len(disputes)}")
        print(f"   Notifications: {len(notifications)}")
        
        print("\n🔑 Test Accounts:")
        print("   Vendors:")
        print("     - vendor1@test.com / password123")
        print("     - vendor2@test.com / password123")
        print("     - vendor3@test.com / password123")
        print("   Suppliers:")
        print("     - supplier1@test.com / password123")
        print("     - supplier2@test.com / password123")
        print("     - supplier3@test.com / password123")

if __name__ == '__main__':
    main()