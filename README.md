# SahiSaudaMarket - Street Food Vendor Marketplace

A comprehensive marketplace platform connecting street food vendors with suppliers, built with Flask (Backend) and Next.js (Frontend).

## 🚀 Features

### For Vendors
- Browse suppliers and products
- Place orders with bulk discounts
- Track order status
- Submit reviews and ratings
- Raise disputes if needed
- Manage profile and business details

### For Suppliers
- List products with images
- Manage inventory and pricing
- Process vendor orders
- Respond to reviews
- Handle disputes
- View analytics and insights

### Platform Features
- JWT Authentication
- File/Image upload support
- Real-time notifications
- Trust scoring system
- Multi-language support (English/Hindi)
- Mobile-responsive design

## 🛠️ Tech Stack

### Backend
- **Framework:** Flask
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT
- **File Uploads:** Werkzeug + Pillow
- **CORS:** Flask-CORS

### Frontend
- **Framework:** Next.js 14
- **UI Library:** Material-UI (MUI)
- **State Management:** React Context
- **HTTP Client:** Axios
- **Styling:** CSS-in-JS

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SahiSaudaMarket
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Database Setup
1. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE sahisauda;
   CREATE USER sahisauda_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE sahisauda TO sahisauda_user;
   ```

2. **Set Environment Variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://sahisauda_user:your_password@localhost:5432/sahisauda
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   UPLOAD_FOLDER=uploads
   ```

#### Run Backend
```bash
python app.py
```
The backend will be available at `http://localhost:5000`

#### Seed Database (Optional)
```bash
python utils/seed_fake_data.py
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Run Frontend
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 🔑 Test Accounts

After running the seed script, you can use these test accounts:

### Vendors
- **Email:** `vendor1@test.com` | **Password:** `password123`
- **Email:** `vendor2@test.com` | **Password:** `password123`
- **Email:** `vendor3@test.com` | **Password:** `password123`

### Suppliers
- **Email:** `supplier1@test.com` | **Password:** `password123`
- **Email:** `supplier2@test.com` | **Password:** `password123`
- **Email:** `supplier3@test.com` | **Password:** `password123`

## 📁 Project Structure

```
SahiSaudaMarket/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Database models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── review.py
│   │   ├── dispute.py
│   │   └── notification.py
│   ├── routes/                # API routes
│   │   ├── auth.py
│   │   ├── vendor.py
│   │   ├── supplier.py
│   │   └── common.py
│   ├── utils/                 # Utility scripts
│   │   └── seed_fake_data.py
│   └── uploads/               # File uploads directory
│
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── .env.local             # Environment variables
    ├── src/
    │   ├── pages/             # Next.js pages
    │   │   ├── index.tsx
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   ├── vendor/
    │   │   └── supplier/
    │   ├── components/        # React components
    │   └── utils/             # Utility functions
    └── public/                # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Vendor Routes
- `GET /api/vendor/suppliers` - Browse suppliers
- `GET /api/vendor/suppliers/{id}` - Get supplier details
- `GET /api/vendor/products` - Search products
- `POST /api/vendor/orders` - Place order
- `GET /api/vendor/orders` - Get vendor orders
- `POST /api/vendor/reviews` - Submit review
- `POST /api/vendor/disputes` - Raise dispute

### Supplier Routes
- `GET /api/supplier/products` - Get supplier products
- `POST /api/supplier/products` - Add product
- `PUT /api/supplier/products/{id}` - Update product
- `DELETE /api/supplier/products/{id}` - Delete product
- `GET /api/supplier/orders` - Get supplier orders
- `PUT /api/supplier/orders/{id}` - Update order status
- `GET /api/supplier/analytics` - Get analytics

### Common Routes
- `GET /api/categories` - Get product categories
- `GET /api/products` - Public product search
- `GET /api/suppliers` - Public supplier directory
- `GET /api/stats` - Platform statistics
- `GET /api/notifications` - User notifications

## 🖼️ File Uploads

The application supports file uploads for:
- User profile images
- Product images
- Additional product images

### Upload Configuration
- **Supported formats:** PNG, JPG, JPEG, GIF, WebP
- **Max file size:** 16MB
- **Image processing:** Automatic resizing to 800x800px
- **Storage:** Local filesystem (`uploads/` directory)

### Upload Endpoints
- `POST /api/auth/register` - Profile image during registration
- `PUT /api/auth/profile` - Update profile image
- `POST /api/supplier/products` - Product images
- `PUT /api/supplier/products/{id}` - Update product images

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- File upload security (extension validation)
- SQL injection protection (SQLAlchemy ORM)

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `flask db upgrade`
5. Start with Gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`

### Frontend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Or deploy to Vercel/Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Updates

- **v1.0.0** - Initial release with core marketplace features
- File upload support
- JWT authentication
- PostgreSQL integration
- Mobile-responsive UI 