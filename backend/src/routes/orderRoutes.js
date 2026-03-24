import express from 'express';
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  verifyUPIPayment,
  getOrderStats,
  getRecentOrders
} from '../controllers/orderController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// User routes
router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);

// UPI Payment verification (Admin)
router.put('/order/:id/verify-upi',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  verifyUPIPayment
);

// Admin routes
router.get(
  '/admin/orders',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllOrders
);

router.get(
  '/admin/orders/stats',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getOrderStats
);

router.get(
  '/admin/orders/recent',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getRecentOrders
);

router.route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;