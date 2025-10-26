import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(dirname(__dirname), '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    console.log('🔧 Create Admin User\n');

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/promotions';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    const email = await question('Email address: ');
    const name = await question('Name (optional): ');
    const password = await question('Password: ');

    if (!email || !password) {
      console.log('\n❌ Email and password are required');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n❌ User with this email already exists');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      name: name || undefined,
      password: hashedPassword,
      role: 'admin',
    });

    await user.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\nCredentials:');
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    console.log('\nYou can now login at http://localhost:3000/admin/login\n');

    await mongoose.connection.close();
    rl.close();
  } catch (error) {
    console.error('\n❌ Error creating user:', error);
    process.exit(1);
  }
}

createAdminUser();
