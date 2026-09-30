// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin & Moderator
router.post('/', protect, authorize('admin', 'moderator'), validateRequest(['name', 'price']), productController.createProduct);
router.put('/:id', protect, authorize('admin', 'moderator'), productController.updateProduct);

// Admin Only
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;