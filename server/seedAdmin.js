import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@fixnear.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`[Seed Admin] Admin account already exists: ${adminEmail}`);
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'System Admin',
      email: adminEmail,
      phone: '+91 99999 88888',
      password: 'Admin@123456',
      role: 'admin'
    });

    console.log(`[Seed Admin] Admin created successfully: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Admin Error] ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
