const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateCategory } = require('../middleware/validation');

// Public routes
router.route('/').get(getCategories).post(protect, admin, validateCategory, createCategory);
router.route('/:id').get(getCategoryById).put(protect, admin, validateCategory, updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;
