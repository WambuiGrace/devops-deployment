const express = require('express');
const router = express.Router();
const {
  getSavedPosts,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/saved').get(protect, getSavedPosts);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

module.exports = router;