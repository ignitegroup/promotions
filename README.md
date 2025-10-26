# Promotions Platform - Enter to Win

A modern, full-stack promotional platform for "Enter to Win" campaigns with a React frontend and Node.js backend. Built with TypeScript, featuring admin dashboard, form collection, integrations, and SEO optimization.

## 🌟 Features

### Frontend
- **Modern React UI** with TypeScript and Vite
- **Responsive Design** with Tailwind CSS
- **Animations** powered by Framer Motion
- **SEO Optimized** with react-helmet-async
- **Form Validation** using React Hook Form and Zod
- **Video & Image Support** for campaign media
- **Multi-page Support** with React Router

### Backend
- **RESTful API** built with Express and TypeScript
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for admin panel
- **Rate Limiting** and security best practices
- **CSV Export** for form submissions
- **Integration Support** for GoHighLevel, Rampwin, and custom webhooks

### Admin Panel
- Campaign management (Create, Read, Update, Delete)
- View and export form submissions
- Integration configuration
- Analytics and reporting
- Role-based access control (Admin, Editor, Viewer)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ignitegroup/promotions.git
cd promotions
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

## 📁 Project Structure

```
promotions/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   └── package.json
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utility functions
│   └── package.json
├── shared/                # Shared types and utilities
└── docs/                  # Documentation
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promotions
JWT_SECRET=your-secret-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000

# GoHighLevel Integration
GOHIGHLEVEL_API_KEY=your-api-key
GOHIGHLEVEL_LOCATION_ID=your-location-id

# Rampwin Integration
RAMPWIN_API_KEY=your-api-key
RAMPWIN_API_URL=https://api.rampwin.com/endpoint
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Creating Your First Campaign

1. **Create an Admin User** (via MongoDB shell or compass):
```javascript
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$...", // Use bcrypt to hash your password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use Node.js to create a hashed password:
```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

2. **Login to Admin Panel**:
   - Navigate to http://localhost:3000/admin/login
   - Enter your credentials

3. **Create a Campaign**:
   - Click "New Campaign" in the dashboard
   - Fill in campaign details
   - Configure form fields
   - Set up integrations (optional)
   - Publish the campaign

## 🔌 Integrations

### GoHighLevel

1. Obtain your API key from GoHighLevel
2. Add to environment variables or configure in admin panel
3. Enable integration for specific campaigns

### Rampwin

1. Get your Rampwin API credentials
2. Configure in environment variables
3. Enable in campaign settings

### Custom Webhooks

1. Set up your webhook endpoint
2. Configure webhook URL in integration settings
3. Submissions will be POST'd to your endpoint

## 🎨 Customization

### Styling
- Edit `frontend/tailwind.config.js` for theme customization
- Modify `frontend/src/styles/index.css` for global styles
- Update colors in the Tailwind config

### Adding New Form Fields
- Extend the `FormField` interface in `frontend/src/types/index.ts`
- Add rendering logic in `frontend/src/pages/CampaignPage.tsx`
- Update validation as needed

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run all tests
npm test
```

## 🏗️ Building for Production

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Deployment

#### Frontend
The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

#### Backend
The backend can be deployed to:
- Heroku
- AWS EC2/ECS
- DigitalOcean
- Railway
- Render

Make sure to:
1. Set production environment variables
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Enable HTTPS
4. Configure proper CORS origins

## 📊 SEO Optimization

The platform includes:
- Dynamic meta tags for each page
- Open Graph tags for social sharing
- Semantic HTML structure
- Fast loading times with Vite
- Mobile-responsive design

To improve SEO further:
1. Add a sitemap.xml
2. Configure robots.txt
3. Implement structured data (JSON-LD)
4. Optimize images and videos

## 🔒 Security Features

- Helmet.js for HTTP headers security
- Rate limiting to prevent abuse
- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt
- MongoDB injection prevention

## 🚧 Roadmap / TODO List

### High Priority
- [ ] Email notifications for new submissions
- [ ] Winner selection mechanism
- [ ] Multiple campaign templates
- [ ] Image/video upload functionality
- [ ] Advanced analytics dashboard
- [ ] Email verification for submissions
- [ ] Duplicate submission prevention
- [ ] Multi-language support

### Medium Priority
- [ ] Social sharing buttons
- [ ] Campaign scheduling
- [ ] A/B testing for campaigns
- [ ] Custom domain support
- [ ] White-label options
- [ ] API rate limiting per user
- [ ] Audit logs
- [ ] Backup and restore

### Low Priority
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced reporting
- [ ] Integration marketplace
- [ ] Campaign templates library
- [ ] Referral system
- [ ] Gamification features

### Integrations to Add
- [ ] Mailchimp
- [ ] SendGrid
- [ ] Zapier
- [ ] HubSpot
- [ ] Salesforce
- [ ] ActiveCampaign
- [ ] ConvertKit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com

## 🙏 Acknowledgments

Built with:
- React
- TypeScript
- Express
- MongoDB
- Tailwind CSS
- Framer Motion
- And many other amazing open-source libraries!