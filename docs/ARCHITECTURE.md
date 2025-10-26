# System Architecture

## Overview

The Promotions Platform is built as a modern full-stack web application with a clear separation between frontend, backend, and database layers.

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│  (Campaign Participants, Administrators)                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│                 (React + TypeScript)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │   Campaign   │  │    Admin     │      │
│  │     Page     │  │     Pages    │  │    Panel     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Features:                                                   │
│  • Responsive UI (Tailwind CSS)                             │
│  • Animations (Framer Motion)                               │
│  • Form Validation (React Hook Form + Zod)                  │
│  • SEO Optimization (react-helmet-async)                    │
│  • Routing (React Router)                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP/HTTPS
                  │ REST API
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                             │
│              (Node.js + Express + TypeScript)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes                                │  │
│  │  • /auth     - Authentication                         │  │
│  │  • /campaigns - Campaign CRUD                         │  │
│  │  • /submissions - Form submissions                    │  │
│  │  • /integrations - Third-party integrations           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware                                │  │
│  │  • Authentication (JWT)                               │  │
│  │  • Authorization (RBAC)                               │  │
│  │  • Rate Limiting                                      │  │
│  │  • CORS                                               │  │
│  │  • Security Headers (Helmet)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers                               │  │
│  │  • Auth Controller                                    │  │
│  │  • Campaign Controller                                │  │
│  │  • Submission Controller                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services                                  │  │
│  │  • Integration Service                                │  │
│  │    - GoHighLevel                                      │  │
│  │    - Rampwin                                          │  │
│  │    - Webhooks                                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │ MongoDB Driver
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│                     (MongoDB)                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │  Campaigns   │  │ Submissions  │      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Features:                                                   │
│  • Document-based storage                                   │
│  • Flexible schema                                          │
│  • Indexing for performance                                 │
│  • Relationships via references                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ GoHighLevel  │  │   Rampwin    │  │   Custom     │      │
│  │     CRM      │  │   Platform   │  │  Webhooks    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Campaign Entry Flow

```
User visits campaign page
         ↓
Frontend fetches campaign data (GET /campaigns/:id)
         ↓
User fills out form
         ↓
Form validation (client-side)
         ↓
Submit to backend (POST /submissions)
         ↓
Backend validates data
         ↓
Save to database
         ↓
Trigger integrations (async)
         ↓
Return success response
         ↓
Show thank you page
```

### 2. Admin Campaign Creation Flow

```
Admin logs in
         ↓
JWT token issued
         ↓
Admin creates campaign
         ↓
Form data sent to backend (POST /campaigns)
         ↓
Authenticate & authorize
         ↓
Validate campaign data
         ↓
Save to database
         ↓
Return campaign object
         ↓
Update admin UI
```

### 3. Integration Flow

```
Form submission saved
         ↓
Integration service triggered
         ↓
For each enabled integration:
  ↓
  Format data for integration
  ↓
  Send HTTP request
  ↓
  Handle response/error
  ↓
  Log result
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **SEO**: react-helmet-async

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **Database ODM**: Mongoose
- **Authentication**: JWT
- **Security**: Helmet, CORS, express-rate-limit
- **Password Hashing**: bcrypt
- **Validation**: express-validator

### Database
- **Database**: MongoDB
- **Schema**: Mongoose models
- **Storage**: Document-based
- **Indexing**: Campaign ID, timestamps

### Development
- **Package Manager**: npm
- **Monorepo**: npm workspaces
- **Linting**: ESLint
- **Formatting**: Prettier
- **Build**: TypeScript Compiler (tsc)
- **Dev Server**: tsx watch

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│         Security Layers                          │
├─────────────────────────────────────────────────┤
│  1. HTTPS/TLS (Production)                      │
├─────────────────────────────────────────────────┤
│  2. CORS (Cross-Origin Protection)              │
├─────────────────────────────────────────────────┤
│  3. Helmet (Security Headers)                   │
├─────────────────────────────────────────────────┤
│  4. Rate Limiting (DDoS Protection)             │
├─────────────────────────────────────────────────┤
│  5. JWT Authentication (Stateless Auth)         │
├─────────────────────────────────────────────────┤
│  6. RBAC (Role-Based Access Control)            │
├─────────────────────────────────────────────────┤
│  7. Input Validation (Data Integrity)           │
├─────────────────────────────────────────────────┤
│  8. Password Hashing (bcrypt)                   │
├─────────────────────────────────────────────────┤
│  9. Environment Variables (Secret Management)   │
└─────────────────────────────────────────────────┘
```

## Deployment Architecture

### Recommended Production Setup

```
                    ┌─────────────┐
                    │   CDN/DNS   │
                    │ (CloudFlare)│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼────┐              ┌────▼────┐
         │Frontend │              │Backend  │
         │(Vercel/ │              │(Railway/│
         │ Netlify)│              │ Heroku) │
         └─────────┘              └────┬────┘
                                       │
                                  ┌────▼────┐
                                  │MongoDB  │
                                  │ Atlas   │
                                  └─────────┘
```

### Alternative: Docker Deployment

```
┌─────────────────────────────────────────────┐
│          Docker Host / Kubernetes           │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Frontend  │  │Backend   │  │MongoDB   │ │
│  │Container │  │Container │  │Container │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │        Nginx Reverse Proxy          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Multiple backend instances
- Load balancer distribution
- Shared MongoDB cluster

### Caching Strategy
- Redis for session data
- API response caching
- Static asset CDN
- Database query caching

### Performance Optimizations
- Database indexing
- Connection pooling
- Lazy loading (frontend)
- Code splitting
- Asset compression

## Monitoring & Logging

```
Application Logs → Log Aggregation (e.g., Papertrail)
                          ↓
Error Tracking (e.g., Sentry)
                          ↓
Performance Monitoring (e.g., New Relic)
                          ↓
Uptime Monitoring (e.g., UptimeRobot)
```

## Backup Strategy

- **Database**: Automated daily backups
- **Files**: S3/Cloud Storage sync
- **Configuration**: Version control
- **Recovery**: Documented restore procedures
