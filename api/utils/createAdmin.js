import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  const adminExists = await User.findOne({ email: 'admin@wandersphere.com' });  // Use 'email' field to check for the admin
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin@wandersphere', 12); // Default password
    const admin = new User({
      email: 'admin@wandersphere.com',  // Add email here
      username: 'admin',  // You can keep username or adjust as needed
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('Default admin user created.');
  } else {
    console.log('Admin user already exists.');
  }
};

export default createAdmin;
