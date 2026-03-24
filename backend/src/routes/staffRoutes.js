import express from 'express';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import SellRequest from '../models/SellRequest.js';

const router = express.Router();

// Middleware — staff ya admin dono access kar sakte hain
const staffOrAdmin = [isAuthenticatedUser, authorizeRoles('admin', 'staff')];

// GET — Saare orders dekho (read + update)
router.get('/orders', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

// PUT — Order status update karo
router.put('/orders/:id', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order nahi mila' });

  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === 'Delivered') {
    order.deliveredAt = Date.now();
    order.isDelivered = true;
  }
  await order.save();
  res.json({ success: true, message: 'Order update ho gaya!', order });
}));

// GET — Saare products dekho (read only)
router.get('/products', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
}));

// GET — Saare users dekho (read only)
router.get('/users', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

// GET — Sell requests dekho
router.get('/sell-requests', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const { status = 'pending' } = req.query;
  const requests = await SellRequest.find({ status })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, requests });
}));

// PUT — Sell request approve/reject karo
router.put('/sell-requests/:id', ...staffOrAdmin, asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sellRequest = await SellRequest.findById(req.params.id);
  if (!sellRequest) return res.status(404).json({ message: 'Request nahi mili' });

  sellRequest.status = status;
  sellRequest.adminNote = adminNote || '';
  await sellRequest.save();

  if (status === 'approved') {
    await Product.create({
      name: sellRequest.name,
      brand: sellRequest.brand,
      category: sellRequest.category,
      price: sellRequest.price,
      description: sellRequest.description,
      images: sellRequest.images,
      isSecondHand: true,
      seller: sellRequest.user,
      stock: 1,
      ratings: 0,
      numReviews: 0,
    });
  }

  res.json({
    success: true,
    message: status === 'approved' ? '✅ Approved!' : '❌ Rejected',
  });
}));

export default router;