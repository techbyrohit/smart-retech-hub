import express from 'express';
import {
  createSellRequest,
  getMySellRequests,
  getAllSellRequests,
  updateSellRequestStatus,
} from '../controllers/sellController.js';

import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

import  upload  from '../middlewares/upload.js';

const router = express.Router();

// User routes
router.post('/', isAuthenticatedUser, upload.array('images', 5), createSellRequest);
router.get('/my-requests', isAuthenticatedUser, getMySellRequests);
router.get('/admin/all', isAuthenticatedUser, authorizeRoles('admin'), getAllSellRequests);
router.put('/admin/:id/status', isAuthenticatedUser, authorizeRoles('admin'), updateSellRequestStatus);
export default router;