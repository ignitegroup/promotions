import { Router } from 'express';
import {
  createSubmission,
  getSubmissionsByCampaign,
  exportSubmissions,
} from '../controllers/submissionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', createSubmission);
router.get('/campaign/:campaignId', authenticate, getSubmissionsByCampaign);
router.get('/campaign/:campaignId/export', authenticate, exportSubmissions);

export default router;
