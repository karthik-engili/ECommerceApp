import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const products = [
  {
    name: 'Aurora Wireless Headphones',
    description: 'Comfortable over-ear headphones with rich bass and long battery life.',
    price: 2499,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stock: 18,
    featured: true
  },
  {
    name: 'Nova Smart Watch',
    description: 'Track workouts, notifications, heart rate, and daily goals from your wrist.',
    price: 3999,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 12,
    featured: true
  },
  {
    name: 'Flux Mechanical Keyboard',
    description: 'Compact RGB mechanical keyboard built for coding, gaming, and everyday work.',
    price: 3299,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    stock: 24,
    featured: false
  },
  {
    name: 'Pulse Bluetooth Speaker',
    description: 'Portable speaker with waterproof design and room-filling sound.',
    price: 1899,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
    stock: 30,
    featured: false
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();

    await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { name: 'Demo User', email: 'user@example.com', password: 'user123', role: 'user' }
    ]);
    await Product.insertMany(products);

    console.log('Seed data imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
