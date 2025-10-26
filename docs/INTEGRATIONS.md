# Integration Guide

This guide explains how to set up and use the various integrations available in the Promotions Platform.

## GoHighLevel Integration

GoHighLevel is a CRM and marketing platform. This integration automatically adds form submissions as contacts in your GoHighLevel account.

### Setup

1. **Get API Credentials:**
   - Log in to your GoHighLevel account
   - Navigate to Settings → API
   - Create a new API key
   - Note your Location ID

2. **Configure in Backend:**
   Edit `backend/.env`:
   ```env
   GOHIGHLEVEL_API_KEY=your-api-key-here
   GOHIGHLEVEL_LOCATION_ID=your-location-id-here
   ```

3. **Enable for Campaign:**
   When creating or editing a campaign, add the integration:
   ```json
   {
     "integrations": [
       {
         "id": "ghl-1",
         "type": "gohighlevel",
         "name": "GoHighLevel CRM",
         "enabled": true,
         "config": {
           "apiKey": "optional-override",
           "locationId": "optional-override"
         }
       }
     ]
   }
   ```

### Data Mapping

The integration maps form fields to GoHighLevel contact fields:
- `email` → Contact email (required)
- `name` → Contact name
- `phone` → Contact phone
- Other fields → Custom fields

### Testing

Use the integration test endpoint:
```bash
POST /api/integrations/{integration-id}/test
```

## Rampwin Integration

Rampwin is a promotional platform. This integration sends form submissions to Rampwin's API.

### Setup

1. **Get API Credentials:**
   - Contact Rampwin support for API access
   - Obtain your API key and endpoint URL

2. **Configure in Backend:**
   Edit `backend/.env`:
   ```env
   RAMPWIN_API_KEY=your-api-key-here
   RAMPWIN_API_URL=https://api.rampwin.com/your-endpoint
   ```

3. **Enable for Campaign:**
   Add to campaign integrations:
   ```json
   {
     "integrations": [
       {
         "id": "rw-1",
         "type": "rampwin",
         "name": "Rampwin",
         "enabled": true,
         "config": {
           "apiKey": "optional-override",
           "apiUrl": "optional-override"
         }
       }
     ]
   }
   ```

## Custom Webhook Integration

Send form submissions to any custom endpoint.

### Setup

1. **Configure Webhook:**
   Add to campaign integrations:
   ```json
   {
     "integrations": [
       {
         "id": "webhook-1",
         "type": "webhook",
         "name": "Custom Webhook",
         "enabled": true,
         "config": {
           "webhookUrl": "https://your-domain.com/webhook"
         }
       }
     ]
   }
   ```

2. **Webhook Payload:**
   Your endpoint will receive POST requests with this format:
   ```json
   {
     "campaignId": "campaign-id",
     "data": {
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "555-1234"
     },
     "submittedAt": "2024-06-15T10:30:00.000Z"
   }
   ```

3. **Response:**
   Your endpoint should return a 200 status code to acknowledge receipt.

### Security

For webhook security, consider:
- Using HTTPS
- Implementing signature verification
- IP whitelisting
- Rate limiting on your endpoint

## Creating Custom Integrations

To add a new integration type:

1. **Update Type Definitions:**
   Add to `backend/src/models/Campaign.ts`:
   ```typescript
   type: 'gohighlevel' | 'rampwin' | 'webhook' | 'custom' | 'your-new-type';
   ```

2. **Implement Service Method:**
   Add to `backend/src/services/integrationService.ts`:
   ```typescript
   private async sendToYourService(integration: any, submission: IFormSubmission) {
     // Implementation here
   }
   ```

3. **Add to Process Method:**
   Update the switch statement in `processSubmission`:
   ```typescript
   case 'your-new-type':
     return this.sendToYourService(integration, submission);
   ```

4. **Update Frontend:**
   Add UI for configuration in the admin panel.

## Troubleshooting

### Common Issues

**Integration not triggering:**
- Check that integration is enabled
- Verify API credentials are correct
- Check backend logs for errors

**Authentication failures:**
- Regenerate API keys
- Verify environment variables are loaded
- Check for expired tokens

**Data not appearing:**
- Verify field mapping is correct
- Check integration service logs
- Test with a simple payload first

### Debug Mode

Enable debug logging:
```env
DEBUG=integration:*
```

View logs:
```bash
cd backend
npm run dev
# Watch console for integration logs
```

## Best Practices

1. **Test First:**
   - Test integrations in development
   - Use integration test endpoints
   - Verify data appears correctly

2. **Monitor:**
   - Check logs regularly
   - Set up error alerts
   - Monitor integration health

3. **Security:**
   - Rotate API keys periodically
   - Use environment variables for secrets
   - Implement retry logic for failed requests

4. **Performance:**
   - Integrations run asynchronously
   - Failed integrations don't block submissions
   - Consider rate limits of third-party APIs

## Support

For integration support:
- Check integration service documentation
- Review error logs
- Contact integration provider support
- Create an issue on GitHub
