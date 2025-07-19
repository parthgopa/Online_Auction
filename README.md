# 🏛️ AuctionHub - Online Auction Bidding System

A comprehensive MERN stack online auction platform that enables users to participate in live auctions, place bids, and manage their auction activities. Built as a final year minor project with modern web technologies and best practices.

![AuctionHub Banner](https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop&crop=center)

## 🌟 Features

### 🔐 Authentication & User Management
- **Secure Registration & Login** with email/password
- **Google OAuth Integration** for seamless social login
- **JWT-based Authentication** with secure token management
- **Password Strength Validation** with real-time feedback
- **User Profile Management** with comprehensive user data
- **Account Verification** and password reset functionality

### 🏠 Home Page & Navigation
- **Responsive Navbar** with dropdown menus on hover
- **Hero Section** with featured auction preview
- **Live Statistics** showing platform activity
- **Featured Auctions** carousel with real-time data
- **Category Browse** with intuitive navigation
- **How It Works** section for new users

### 🎨 Design & UI/UX
- **Professional Color Theme** with consistent branding
- **Bootstrap 5** integration for responsive design
- **Custom CSS Variables** for easy theme management
- **Mobile-First Design** with perfect responsiveness
- **Smooth Animations** and hover effects
- **Accessibility Features** with ARIA labels

### 🛠️ Technical Features
- **MERN Stack Architecture** (MongoDB, Express.js, React.js, Node.js)
- **RESTful API Design** with proper HTTP methods
- **MongoDB Cloud Integration** with secure connection
- **Real-time Validation** on both frontend and backend
- **Error Handling** with user-friendly messages
- **Security Best Practices** with input sanitization

## 🚀 Tech Stack

### Frontend
- **React.js 19.1.0** - Modern UI library
- **React Router DOM 7.7.0** - Client-side routing
- **Bootstrap 5.3.7** - Responsive CSS framework
- **Font Awesome** - Icon library
- **@react-oauth/google** - Google OAuth integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.16.4** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Development Tools
- **nodemon** - Development server auto-restart
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Online_Auction/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── layout/        # Layout components (Navbar)
│   │   │   ├── pages/         # Page components (Home)
│   │   │   └── user/          # User-related components
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── theme.css          # Custom theme styles
│   │   └── App.js             # Main App component
│   ├── .env                   # Frontend environment variables
│   └── package.json           # Frontend dependencies
├── server/                     # Node.js backend
│   ├── config/
│   │   └── passport.js        # Passport configuration
│   ├── models/
│   │   └── User.js            # User model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── user.js            # User management routes
│   ├── .env                   # Backend environment variables
│   ├── index.js               # Server entry point
│   └── package.json           # Backend dependencies
└── README.md                   # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas Account** (for cloud database)
- **Google Cloud Console Account** (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/online-auction.git
cd online-auction
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/online_auction?retryWrites=true&w=majority&tls=true
DB_NAME=online_auction

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_session_secret_here_make_it_complex
```

#### Start Backend Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Environment Configuration
Create a `.env` file in the `client` directory:

```env
# React App Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### Start Frontend Application
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` files

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required for non-OAuth users),
  googleId: String (for OAuth users),
  avatar: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  bidHistory: [{
    auctionId: ObjectId,
    bidAmount: Number,
    bidTime: Date
  }],
  wonAuctions: [ObjectId],
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback
- `POST /logout` - User logout
- `GET /me` - Get current user
- `POST /verify-token` - Verify JWT token

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `GET /bid-history` - Get user's bid history
- `GET /won-auctions` - Get user's won auctions
- `DELETE /account` - Deactivate account

## 🎨 Theme & Styling

### Color Palette
- **Primary**: #2c3e50 (Dark Blue-Gray)
- **Secondary**: #e74c3c (Auction Red)
- **Accent**: #f39c12 (Golden Orange)
- **Success**: #27ae60 (Green)
- **Background**: #f8f9fa (Light Gray)

### Custom CSS Classes
- `.btn-primary-custom` - Primary buttons
- `.btn-secondary-custom` - Secondary buttons
- `.card-custom` - Custom cards with hover effects
- `.navbar-custom` - Navigation bar styling
- `.auction-card` - Auction item cards

## 🔒 Security Features

- **Password Hashing** with bcryptjs (salt rounds: 12)
- **JWT Token Authentication** with expiration
- **Input Validation** on both client and server
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **SQL Injection Prevention** with Mongoose
- **XSS Protection** with input sanitization

## 📱 Responsive Design

- **Mobile-First Approach** with Bootstrap breakpoints
- **Flexible Grid System** for all screen sizes
- **Touch-Friendly Interface** for mobile devices
- **Optimized Images** with proper aspect ratios
- **Accessible Navigation** with keyboard support

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the application: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in deployment platform

### Backend Deployment (Heroku/Railway)
1. Set up environment variables
2. Deploy from GitHub repository
3. Ensure MongoDB Atlas whitelist includes deployment IPs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Final Year Student
- Minor Project: Online Auction Bidding System
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- **MongoDB Atlas** for cloud database hosting
- **Google Cloud Platform** for OAuth services
- **Bootstrap Team** for the responsive framework
- **React Team** for the amazing frontend library
- **Express.js Community** for the robust backend framework

## 📞 Support

If you have any questions or need help with setup, please:
1. Check the [Issues](https://github.com/yourusername/online-auction/issues) page
2. Create a new issue with detailed description
3. Contact the author via email

---

**⭐ If you found this project helpful, please give it a star!**

**🔗 Live Demo**: [AuctionHub Live](https://your-deployment-url.com)

**📺 Video Demo**: [YouTube Demo](https://youtube.com/your-demo-video)

---

*Built with ❤️ using MERN Stack*

This