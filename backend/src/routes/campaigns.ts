import { Router } from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', authenticate, authorize('admin', 'editor'), createCampaign);
router.put('/:id', authenticate, authorize('admin', 'editor'), updateCampaign);
router.delete('/:id', authenticate, authorize('admin'), deleteCampaign);

export default router;
