import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Campaign } from '../src/models/Campaign.js';
import { FormSubmission } from '../src/models/FormSubmission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(dirname(__dirname), '.env') });

const sampleCampaigns = [
  {
    title: 'Summer Vacation Giveaway',
    description: 'Enter to win an all-expenses-paid vacation to Hawaii! One lucky winner will receive flights, hotel, and spending money for a week in paradise.',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    status: 'active',
    bannerImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    fields: [
      { id: 'f1', name: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'f2', name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'f3', name: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'f4', name: 'phone', label: 'Phone Number', type: 'phone', required: false },
      { id: 'f5', name: 'age', label: 'Age Group', type: 'select', required: true, options: ['18-25', '26-35', '36-45', '46-55', '56+'] },
    ],
  },
  {
    title: 'Tech Bundle Giveaway',
    description: 'Win the latest tech gadgets! Prize includes laptop, tablet, wireless headphones, and more.',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-07-15'),
    status: 'active',
    bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
    fields: [
      { id: 'f1', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'f2', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'f3', name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', required: false },
    ],
  },
  {
    title: 'Shopping Spree Contest',
    description: 'Enter for a chance to win a $5,000 shopping spree at your favorite stores!',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-31'),
    status: 'ended',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    fields: [
      { id: 'f1', name: 'name', label: 'Name', type: 'text', required: true },
      { id: 'f2', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'f3', name: 'favoriteStore', label: 'Favorite Store', type: 'text', required: false },
    ],
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/promotions';
    
    console.log('🌱 Seeding database...\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected\n');

    // Clear existing data
    console.log('Clearing existing campaigns and submissions...');
    await Campaign.deleteMany({});
    await FormSubmission.deleteMany({});
    console.log('✓ Cleared\n');

    // Insert sample campaigns
    console.log('Creating sample campaigns...');
    const campaigns = await Campaign.insertMany(sampleCampaigns);
    console.log(`✓ Created ${campaigns.length} campaigns\n`);

    // Create sample submissions for active campaigns
    console.log('Creating sample submissions...');
    let submissionCount = 0;

    for (const campaign of campaigns) {
      if (campaign.status === 'active') {
        const submissions = [];
        const numSubmissions = Math.floor(Math.random() * 10) + 5; // 5-15 submissions

        for (let i = 0; i < numSubmissions; i++) {
          const data = new Map();
          
          campaign.fields.forEach((field) => {
            switch (field.type) {
              case 'text':
                data.set(field.name, `Sample ${field.label} ${i + 1}`);
                break;
              case 'email':
                data.set(field.name, `user${i + 1}@example.com`);
                break;
              case 'phone':
                data.set(field.name, `555-${String(i).padStart(4, '0')}`);
                break;
              case 'select':
                if (field.options && field.options.length > 0) {
                  const randomOption = field.options[Math.floor(Math.random() * field.options.length)];
                  data.set(field.name, randomOption);
                }
                break;
              case 'checkbox':
                data.set(field.name, Math.random() > 0.5 ? 'true' : 'false');
                break;
            }
          });

          submissions.push({
            campaignId: campaign._id,
            data,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Sample User Agent)',
            submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          });
        }

        await FormSubmission.insertMany(submissions);
        submissionCount += submissions.length;
      }
    }

    console.log(`✓ Created ${submissionCount} sample submissions\n`);

    console.log('✅ Database seeded successfully!\n');
    console.log('You can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Visit http://localhost:3000 to see the campaigns');
    console.log('3. Login to admin panel at http://localhost:3000/admin/login\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
