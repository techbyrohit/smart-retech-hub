import SellRequest from '../models/SellRequest.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// User: Naya sell request submit karo
export const createSellRequest = async (req, res) => {
  try {
    const { name, brand, category, price, description } = req.body;

    if (!name || !brand || !category || !price || !description) {
      return res.status(400).json({ message: 'Sab fields required hain' });
    }

    // Uploaded image URLs (multer/cloudinary se aayengi)
    // Cloudinary pe upload karo
const images = [];
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'smart-retech/sell-requests',
    });
    images.push(result.secure_url);
  }
}

    if (images.length === 0) {
      return res.status(400).json({ message: 'Kam se kam ek photo zaroor add karo' });
    }

    const sellRequest = await SellRequest.create({
      user: req.user._id,
      name,
      brand,
      category,
      price: Number(price),
      description,
      images,
    });

    res.status(201).json({
      message: 'Request submit ho gayi! Admin approve karega jaldi.',
      sellRequest,
    });
  } catch (error) {
    console.error('Sell request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User: Apni requests dekho
export const getMySellRequests = async (req, res) => {
  try {
    const requests = await SellRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Saari pending requests dekho
export const getAllSellRequests = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const requests = await SellRequest.find({ status })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Request approve ya reject karo
export const updateSellRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const sellRequest = await SellRequest.findById(id).populate('user', 'name');
    if (!sellRequest) {
      return res.status(404).json({ message: 'Request nahi mili' });
    }

    sellRequest.status = status;
    sellRequest.adminNote = adminNote || '';
    await sellRequest.save();

    // Agar approve hua toh Product collection mein add karo
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
      message: status === 'approved' ? '✅ Product approve ho gaya!' : '❌ Request reject kar di',
      sellRequest,
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};