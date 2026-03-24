import sendEmail from '../utils/sendEmail.js';
import {
  orderConfirmationTemplate,
  orderShippedTemplate
} from '../templates/emailTemplates.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';

/* =========================
   CREATE NEW ORDER
   Supports: COD, UPI
========================= */
export const newOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  // Determine paidAt only if payment is already done (UPI pending verification or succeeded)
  const isPaid =
    paymentInfo?.status === 'succeeded' ||
    paymentInfo?.status === 'pending_verification';

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: isPaid ? Date.now() : null
  });

  // Send order confirmation email
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Order Confirmation - Smart-Retech',
      message: orderConfirmationTemplate(order, req.user)
    });
  } catch (error) {
    console.log('Email sending failed:', error.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order
  });
});

/* =========================
   GET SINGLE ORDER
========================= */
export const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

/* =========================
   LOGGED-IN USER ORDERS
========================= */
export const myOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    orders
  });
});

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email');

  const totalAmount = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  });
});

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
export const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Order already delivered', 400));
  }

  // Update stock when order is shipped
  if (req.body.status === 'Shipped') {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }

    // Send shipped email
    try {
      await sendEmail({
        email: order.user.email,
        subject: 'Your Order Has Shipped - Smart-Retech',
        message: orderShippedTemplate(order, order.user)
      });
    } catch (error) {
      console.log('Email sending failed:', error.message);
    }
  }

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully'
  });
});

/* =========================
   VERIFY UPI PAYMENT (ADMIN)
   Admin manually verifies UTR
========================= */
export const verifyUPIPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  if (order.paymentInfo?.method !== 'UPI') {
    return next(new ErrorHandler('This order is not a UPI payment', 400));
  }

  const { verified } = req.body; // true = verified, false = rejected

  if (verified) {
    order.paymentInfo.status = 'succeeded';
    order.paidAt = Date.now();

    // Send payment confirmed email
    try {
      await sendEmail({
        email: order.user.email,
        subject: 'Payment Confirmed - Smart-Retech',
        message: `
          <h2>Payment Confirmed!</h2>
          <p>Hi ${order.user.name},</p>
          <p>Your UPI payment of ₹${order.totalPrice} has been verified successfully.</p>
          <p>Order ID: ${order._id}</p>
          <p>UTR Number: ${order.paymentInfo.utrNumber}</p>
          <p>Your order is now being processed.</p>
          <p>Thank you for shopping with Smart-Retech!</p>
        `
      });
    } catch (error) {
      console.log('Email sending failed:', error.message);
    }
  } else {
    order.paymentInfo.status = 'failed';
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: verified
      ? 'UPI payment verified successfully'
      : 'UPI payment marked as failed'
  });
});

/* =========================
   UPDATE PRODUCT STOCK
========================= */
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) return;
  product.stock = Math.max(0, product.stock - quantity);
  await product.save({ validateBeforeSave: false });
}

/* =========================
   DELETE ORDER (ADMIN)
========================= */
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

/* =========================
   ORDER STATS (ADMIN)
========================= */
export const getOrderStats = asyncHandler(async (req, res, next) => {
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'succeeded' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        'paymentInfo.status': 'succeeded'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      monthlyRevenue
    }
  });
});

/* =========================
   RECENT ORDERS (ADMIN)
========================= */
export const getRecentOrders = asyncHandler(async (req, res, next) => {
  const limit = Number(req.query.limit) || 10;

  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    orders
  });
});