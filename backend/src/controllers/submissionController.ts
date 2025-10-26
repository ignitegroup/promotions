import { Request, Response } from 'express';
import { FormSubmission } from '../models/FormSubmission.js';
import { Campaign } from '../models/Campaign.js';
import { integrationService } from '../services/integrationService.js';

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { campaignId, data } = req.body;

    // Verify campaign exists and is active
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ message: 'Campaign is not active' });
    }

    // Create submission
    const submission = new FormSubmission({
      campaignId,
      data,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await submission.save();

    // Trigger integrations
    if (campaign.integrations && campaign.integrations.length > 0) {
      integrationService.processSubmission(campaign, submission).catch((err) => {
        console.error('Integration error:', err);
      });
    }

    res.status(201).json(submission);
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubmissionsByCampaign = async (req: Request, res: Response) => {
  try {
    const submissions = await FormSubmission.find({
      campaignId: req.params.campaignId,
    }).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await FormSubmission.find({
      campaignId: req.params.campaignId,
    }).sort({ submittedAt: -1 });

    // Convert to CSV
    if (submissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found' });
    }

    const headers = new Set<string>();
    submissions.forEach((sub) => {
      Object.keys(sub.data.toObject()).forEach((key) => headers.add(key));
    });

    const csvHeaders = Array.from(headers).join(',');
    const csvRows = submissions.map((sub) => {
      const row = Array.from(headers).map((header) => {
        const value = sub.data.get(header) || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      return row.join(',');
    });

    const csv = [csvHeaders, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=submissions-${req.params.campaignId}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error('Export submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
