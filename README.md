# 🏠 Real Estate Web Application

A modern, full-stack real estate web application built with React frontend and Node.js backend, featuring property listings, search functionality, and user authentication.

## ✨ Features

### Frontend Features
- 🎨 **Modern UI/UX** - Beautiful, responsive design with light theme
- 🔍 **Advanced Search** - Autocomplete search with location and property type filters
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🏠 **Property Listings** - Modern card-based layout with hover effects
- 🗺️ **Location Tags** - Country and city indicators for each property
- 💰 **Price Display** - Prominent pricing with secure payment badges
- 🎯 **Smart Navigation** - Sticky navigation with search integration

### Backend Features
- 🔐 **JWT Authentication** - Secure user login and registration
- 🛡️ **Password Hashing** - bcrypt encryption for user security
- 👥 **Role-Based Access** - User and admin role management
- 🌍 **International Listings** - Properties from multiple countries
- 📊 **Database Seeding** - Pre-populated with sample property data
- 🔍 **Search API** - Backend search functionality with filters

### Property Data
- **Countries**: India, USA, UK, Dubai, Singapore, Australia, France
- **Property Types**: Apartments, Houses, Villas, Penthouses
- **Features**: Price, Location, Bedrooms, Bathrooms, Area, Description

## 🚀 Tech Stack

### Frontend
- **React** - Modern JavaScript framework
- **CSS3** - Custom styling with modern design
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Add your MongoDB connection string and JWT secret

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Database Seeding
```bash
# Navigate to backend directory
cd backend

# Run the seeding script
node seed.js
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## 📱 Usage

### For Users
1. **Browse Properties** - View all available properties on the listings page
2. **Search & Filter** - Use the search bar and filters to find specific properties
3. **View Details** - Click on property cards to see detailed information
4. **Register/Login** - Create an account or sign in to access additional features

### For Developers
1. **Clone the repository**
2. **Install dependencies** for both frontend and backend
3. **Set up environment variables**
4. **Run the seeding script** to populate the database
5. **Start both servers**

## 🏗️ Project Structure

```
real-estate-app/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main App component
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   ├── seed.js            # Database seeding script
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users can create new accounts
- **Login**: Secure authentication with password hashing
- **Role-Based Access**: Different permissions for users and admins
- **Token Management**: Automatic token refresh and validation

## 🌍 International Properties

The application includes properties from various countries:

- **India**: Mumbai, Bangalore, Delhi
- **USA**: New York, Los Angeles, Miami
- **UK**: London, Manchester
- **Dubai**: Various locations
- **Singapore**: Prime locations
- **Australia**: Major cities
- **France**: Paris and other cities

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Hover Effects**: Interactive elements with smooth transitions
- **Color Scheme**: Blue and white theme for trust and professionalism
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages and fallbacks

## 🔍 Search & Filter Features

- **Autocomplete Search**: Smart suggestions based on property data
- **Location Filter**: Filter by country and city
- **Property Type Filter**: Filter by apartment, house, villa, etc.
- **Price Range**: Filter by price brackets
- **Real-time Results**: Instant search results as you type

## 🚀 Deployment

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set up environment variables on the hosting platform
- Configure MongoDB connection (local or cloud)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pratheek** - [GitHub Profile](https://github.com/pratheek7369)

## 🙏 Acknowledgments

- React.js community for the amazing framework
- Node.js and Express.js for the robust backend
- MongoDB for the flexible database solution
- All contributors and supporters

---

HEAD
**Happy House Hunting! 🏠✨** 

**Happy House Hunting! 🏠✨**
a8a9ef5fa40473c4585ff2f1e89d862a6c7f5114
