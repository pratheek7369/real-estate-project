// Configuration for API URLs
const config = {
  // Development environment
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  // Production environment - replace with your actual backend URL after deployment
  production: {
    API_BASE_URL: 'https://your-backend-url.onrender.com' // Replace with your actual backend URL
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_BASE_URL = config[environment].API_BASE_URL; 