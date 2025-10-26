# Deployment Guide

This guide covers deploying the Promotions Platform to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Domain name (optional)
- SSL certificate (if self-hosting)

## Environment Setup

### Backend Environment Variables

Create `.env` in the backend directory:

```env
NODE_ENV=production
PORT=5000

# Database - Use MongoDB Atlas or your production database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/promotions?retryWrites=true&w=majority

# JWT Secret - Generate a strong secret
JWT_SECRET=your-very-strong-secret-key-min-32-chars

# CORS - Your frontend URL
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/uploads

# Integrations
GOHIGHLEVEL_API_KEY=your-production-key
GOHIGHLEVEL_LOCATION_ID=your-location-id
RAMPWIN_API_KEY=your-production-key
RAMPWIN_API_URL=https://api.rampwin.com/endpoint
```

### Frontend Environment Variables

Create `.env.production` in the frontend directory:

```env
VITE_API_URL=https://api.your-domain.com/api
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel dashboard.

#### Backend to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
cd backend
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard.

### Option 2: AWS (Complete Stack)

#### Backend on EC2

1. Launch EC2 instance (Ubuntu 20.04+)

2. Install dependencies:
```bash
sudo apt update
sudo apt install nodejs npm nginx
```

3. Clone and build:
```bash
git clone https://github.com/ignitegroup/promotions.git
cd promotions/backend
npm install
npm run build
```

4. Setup PM2:
```bash
npm install -g pm2
pm2 start dist/index.js --name promotions-api
pm2 startup
pm2 save
```

5. Configure Nginx:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. Enable SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

#### Frontend on S3 + CloudFront

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Create S3 bucket and upload:
```bash
aws s3 mb s3://your-bucket-name
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure S3 for static hosting.

4. Create CloudFront distribution pointing to S3.

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository

2. Configure build settings:
   - **Backend:**
     - Build command: `cd backend && npm install && npm run build`
     - Run command: `cd backend && npm start`
   
   - **Frontend:**
     - Build command: `cd frontend && npm install && npm run build`
     - Output directory: `frontend/dist`

3. Add environment variables in dashboard.

### Option 4: Docker Deployment

#### Build Images

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/promotions?authSource=admin
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Deploy:
```bash
docker-compose up -d
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for production)
5. Get connection string
6. Update MONGODB_URI in environment variables

### Self-Hosted MongoDB

1. Install MongoDB:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

2. Secure MongoDB:
```bash
mongosh
> use admin
> db.createUser({user: "admin", pwd: "password", roles: ["root"]})
```

3. Enable authentication in `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
```

## SSL/HTTPS

### Let's Encrypt (Free)

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Custom Certificate

Update Nginx config:
```nginx
ssl_certificate /path/to/certificate.crt;
ssl_certificate_key /path/to/private.key;
```

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

### Uptime Monitoring

Set up with:
- UptimeRobot
- Pingdom
- StatusCake

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/node
```

In `backend/src/index.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: config.env,
});
```

## Backup Strategy

### Database Backups

Automated MongoDB backup:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/$DATE"
tar -czf "/backups/backup_$DATE.tar.gz" "/backups/$DATE"
rm -rf "/backups/$DATE"

# Keep only last 7 days
find /backups -type f -mtime +7 -delete
```

Add to cron:
```bash
0 2 * * * /path/to/backup.sh
```

### File Backups

Sync uploads to S3:
```bash
aws s3 sync /var/www/uploads s3://your-backup-bucket/uploads
```

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Enable CORS only for your domain
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules
- [ ] Keep dependencies updated
- [ ] Enable rate limiting
- [ ] Implement CSRF protection
- [ ] Use environment variables for secrets
- [ ] Regular security audits
- [ ] Monitor error logs
- [ ] Set up automated backups

## Performance Optimization

1. **Enable Compression:**
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Add Redis Caching:**
```bash
npm install redis
```

3. **CDN for Static Assets:**
   - Use CloudFlare or AWS CloudFront
   - Configure cache headers

4. **Database Indexing:**
```javascript
// In models
submissionSchema.index({ campaignId: 1, submittedAt: -1 });
campaignSchema.index({ status: 1, endDate: -1 });
```

## Troubleshooting

### Application not starting
- Check environment variables
- Verify MongoDB connection
- Review error logs
- Check port availability

### Database connection issues
- Verify MongoDB is running
- Check connection string
- Verify network access
- Check credentials

### High memory usage
- Check for memory leaks
- Increase instance size
- Enable memory profiling
- Review database queries

## Support

For deployment help:
- Check documentation
- Review error logs
- Create GitHub issue
- Contact support team
