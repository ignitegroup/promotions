# Getting Started Guide

This guide will help you set up and run the Promotions Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB** - Either:
  - [Local installation](https://www.mongodb.com/docs/manual/installation/)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/ignitegroup/promotions.git
cd promotions
```

### 2. Run Setup Script

The setup script will install all dependencies and create configuration files:

```bash
chmod +x setup.sh
./setup.sh
```

Alternatively, install manually:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Backend Environment

Edit `backend/.env` with your settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promotions
JWT_SECRET=change-this-to-a-random-secret-key
CORS_ORIGIN=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a random string for security.

To generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start MongoDB

If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, update `MONGODB_URI` in `.env` with your connection string.

### 5. Create Admin User

```bash
cd backend
npm run create-admin
```

Follow the prompts to create your admin account.

### 6. Seed Sample Data (Optional)

To populate the database with sample campaigns:

```bash
cd backend
npm run seed
```

### 7. Start the Application

From the root directory:

```bash
npm run dev
```

This starts both frontend and backend servers:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## First Steps

### 1. Visit the Homepage

Open your browser to http://localhost:3000

You should see the landing page with any active campaigns (if you ran the seed script).

### 2. Login to Admin Panel

1. Go to http://localhost:3000/admin/login
2. Enter the credentials you created
3. You'll be redirected to the dashboard

### 3. Create Your First Campaign

From the admin dashboard:

1. Click "New Campaign"
2. Fill in the campaign details:
   - **Title:** Name of your campaign
   - **Description:** What participants can win
   - **Start/End Dates:** Campaign duration
   - **Status:** Set to "active" to make it live
3. Add form fields:
   - Name, email (required for most campaigns)
   - Any additional fields you need
4. Save the campaign

### 4. Test the Campaign

1. Go back to the homepage
2. Click on your campaign
3. Fill out and submit the form
4. Return to the admin dashboard to see the submission

## Project Structure

```
promotions/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript definitions
│   │   └── styles/       # CSS and styling
│   └── package.json
│
├── backend/              # Node.js backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   ├── scripts/          # Utility scripts
│   └── package.json
│
├── docs/                 # Documentation
└── package.json          # Root package (workspaces)
```

## Common Commands

### Development

```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

### Building

```bash
# Build both
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Database

```bash
# Create admin user
cd backend && npm run create-admin

# Seed sample data
cd backend && npm run seed
```

### Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

## Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running: `mongod`
2. Check the connection string in `backend/.env`
3. If using Atlas, verify your IP is whitelisted

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Stop any process using the port
2. Or change the port in configuration files

### Module Not Found

**Problem:** `Error: Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

### Authentication Not Working

**Problem:** Can't login to admin panel

**Solution:**
1. Verify admin user exists in database
2. Check JWT_SECRET is set in `backend/.env`
3. Clear browser cookies and try again

## Next Steps

Now that you have the platform running:

1. **Customize the Design**
   - Edit `frontend/tailwind.config.js` for colors
   - Modify `frontend/src/styles/index.css` for global styles

2. **Set Up Integrations**
   - See `docs/INTEGRATIONS.md`
   - Configure GoHighLevel, Rampwin, or webhooks

3. **Deploy to Production**
   - See `docs/DEPLOYMENT.md`
   - Choose your hosting platform

4. **Add Features**
   - Check `TODO.md` for enhancement ideas
   - See `CONTRIBUTING.md` to contribute

## Getting Help

- **Documentation:** Check the `docs/` folder
- **API Reference:** See `docs/API.md`
- **Issues:** [GitHub Issues](https://github.com/ignitegroup/promotions/issues)

## Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Happy building! 🚀
