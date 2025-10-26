# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login to get JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

#### GET /auth/me
Get current user information (requires authentication).

**Response:**
```json
{
  "id": "user-id",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin"
}
```

### Campaigns

#### GET /campaigns
Get all campaigns.

**Response:**
```json
[
  {
    "id": "campaign-id",
    "title": "Summer Giveaway",
    "description": "Enter to win amazing prizes!",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T23:59:59.000Z",
    "status": "active",
    "fields": [...],
    "integrations": [...]
  }
]
```

#### GET /campaigns/:id
Get a specific campaign by ID.

#### POST /campaigns
Create a new campaign (requires authentication, admin/editor role).

**Request:**
```json
{
  "title": "Summer Giveaway",
  "description": "Enter to win amazing prizes!",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-08-31T23:59:59.000Z",
  "status": "active",
  "fields": [
    {
      "id": "field-1",
      "name": "name",
      "label": "Full Name",
      "type": "text",
      "required": true
    },
    {
      "id": "field-2",
      "name": "email",
      "label": "Email Address",
      "type": "email",
      "required": true
    }
  ],
  "integrations": []
}
```

#### PUT /campaigns/:id
Update a campaign (requires authentication, admin/editor role).

#### DELETE /campaigns/:id
Delete a campaign (requires authentication, admin role).

### Submissions

#### POST /submissions
Create a new form submission.

**Request:**
```json
{
  "campaignId": "campaign-id",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }
}
```

**Response:**
```json
{
  "id": "submission-id",
  "campaignId": "campaign-id",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "submittedAt": "2024-06-15T10:30:00.000Z"
}
```

#### GET /submissions/campaign/:campaignId
Get all submissions for a campaign (requires authentication).

**Response:**
```json
[
  {
    "id": "submission-id",
    "campaignId": "campaign-id",
    "data": {...},
    "submittedAt": "2024-06-15T10:30:00.000Z"
  }
]
```

#### GET /submissions/campaign/:campaignId/export
Export submissions as CSV (requires authentication).

**Response:**
CSV file download

### Health Check

#### GET /health
Check API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-06-15T10:30:00.000Z"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "message": "Invalid request parameters"
}
```

**401 Unauthorized:**
```json
{
  "message": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error"
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

When rate limit is exceeded:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```
