import axios from 'axios';
import { config } from '../config/index.js';
import { ICampaign } from '../models/Campaign.js';
import { IFormSubmission } from '../models/FormSubmission.js';

class IntegrationService {
  async processSubmission(campaign: ICampaign, submission: IFormSubmission) {
    if (!campaign.integrations) return;

    const promises = campaign.integrations
      .filter((integration) => integration.enabled)
      .map((integration) => {
        switch (integration.type) {
          case 'gohighlevel':
            return this.sendToGoHighLevel(integration, submission);
          case 'rampwin':
            return this.sendToRampwin(integration, submission);
          case 'webhook':
            return this.sendToWebhook(integration, submission);
          default:
            return Promise.resolve();
        }
      });

    await Promise.allSettled(promises);
  }

  private async sendToGoHighLevel(integration: any, submission: IFormSubmission) {
    try {
      const apiKey = config.integrations.goHighLevel.apiKey || integration.config.apiKey;
      const locationId =
        config.integrations.goHighLevel.locationId || integration.config.locationId;

      if (!apiKey || !locationId) {
        console.warn('GoHighLevel integration not configured');
        return;
      }

      const data = submission.data.toObject();

      await axios.post(
        `https://rest.gohighlevel.com/v1/contacts/`,
        {
          email: data.email,
          name: data.name,
          phone: data.phone,
          locationId,
          customFields: data,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Sent to GoHighLevel successfully');
    } catch (error) {
      console.error('GoHighLevel integration error:', error);
      throw error;
    }
  }

  private async sendToRampwin(integration: any, submission: IFormSubmission) {
    try {
      const apiKey = config.integrations.rampwin.apiKey || integration.config.apiKey;
      const apiUrl = config.integrations.rampwin.apiUrl || integration.config.apiUrl;

      if (!apiKey || !apiUrl) {
        console.warn('Rampwin integration not configured');
        return;
      }

      await axios.post(
        apiUrl,
        {
          submission: submission.data.toObject(),
          campaignId: submission.campaignId,
        },
        {
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Sent to Rampwin successfully');
    } catch (error) {
      console.error('Rampwin integration error:', error);
      throw error;
    }
  }

  private async sendToWebhook(integration: any, submission: IFormSubmission) {
    try {
      const webhookUrl = integration.config.webhookUrl;

      if (!webhookUrl) {
        console.warn('Webhook URL not configured');
        return;
      }

      await axios.post(webhookUrl, {
        campaignId: submission.campaignId,
        data: submission.data.toObject(),
        submittedAt: submission.submittedAt,
      });

      console.log('Sent to webhook successfully');
    } catch (error) {
      console.error('Webhook integration error:', error);
      throw error;
    }
  }
}

export const integrationService = new IntegrationService();
