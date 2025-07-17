const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Find a seller user (or create one)
  let seller = await User.findOne({ role: 'seller' });
  if (!seller) {
    seller = await User.create({
      name: 'Demo Seller',
      email: 'seller@example.com',
      password: '$2a$10$7Qw8Qw8Qw8Qw8Qw8Qw8QwOQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8', // 'password' hashed
      role: 'seller',
      isVerified: true
    });
  }

  // International dummy listings
  const listings = [
    {
      title: 'Modern Apartment in City Center',
      description: 'A beautiful 2BHK apartment with all amenities, close to metro and shopping.',
      price: 7500000,
      location: 'Bangalore, India',
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
      ],
      seller: seller._id
    },
    {
      title: 'Cozy Villa with Garden',
      description: 'Spacious villa with a private garden, perfect for families.',
      price: 12500000,
      location: 'Pune, India',
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
      ],
      seller: seller._id
    },
    {
      title: 'Luxury Penthouse',
      description: 'Top-floor penthouse with city views and premium facilities.',
      price: 25000000,
      location: 'Mumbai, India',
      images: [
        'https://images.unsplash.com/photo-1468436139062-f60a71c5c892',
        'https://images.unsplash.com/photo-1503389152951-9c3d0c6b7a5a'
      ],
      seller: seller._id
    },
    {
      title: 'Downtown Condo',
      description: 'Modern condo in the heart of New York City with skyline views.',
      price: 1200000,
      location: 'New York, USA',
      images: [
        'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
      ],
      seller: seller._id
    },
    {
      title: 'Beachfront Villa',
      description: 'Stunning villa with private beach access in Miami.',
      price: 3500000,
      location: 'Miami, USA',
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      ],
      seller: seller._id
    },
    {
      title: 'Central London Flat',
      description: 'Elegant flat in Central London, close to Hyde Park.',
      price: 2200000,
      location: 'London, UK',
      images: [
        'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
      ],
      seller: seller._id
    },
    {
      title: 'Dubai Marina Apartment',
      description: 'Luxury apartment with marina views and world-class amenities.',
      price: 1800000,
      location: 'Dubai, UAE',
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
      ],
      seller: seller._id
    },
    {
      title: 'Singapore City Loft',
      description: 'Chic loft in Singapore’s business district, perfect for professionals.',
      price: 950000,
      location: 'Singapore',
      images: [
        'https://images.unsplash.com/photo-1468436139062-f60a71c5c892',
        'https://images.unsplash.com/photo-1503389152951-9c3d0c6b7a5a'
      ],
      seller: seller._id
    },
    {
      title: 'Sydney Harbour House',
      description: 'House with breathtaking views of Sydney Harbour Bridge.',
      price: 2700000,
      location: 'Sydney, Australia',
      images: [
        'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'
      ],
      seller: seller._id
    },
    {
      title: 'Parisian Penthouse',
      description: 'Romantic penthouse with Eiffel Tower views.',
      price: 2100000,
      location: 'Paris, France',
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      ],
      seller: seller._id
    }
  ];

  await Listing.deleteMany({});
  await Listing.insertMany(listings);
  console.log('International dummy listings inserted!');
  mongoose.disconnect();
}

seed(); 