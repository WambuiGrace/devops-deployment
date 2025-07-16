const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  savePost,
} = require('../controllers/postController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validatePost, validateComment } = require('../middleware/validation');

router.route('/').get(getPosts).post(protect, admin, validatePost, createPost);
router.route('/:id').get(getPostById).put(protect, admin, validatePost, updatePost).delete(protect, admin, deletePost);
router.route('/:id/like').post(protect, likePost);
router.route('/:id/comment').post(protect, validateComment, commentOnPost);
router.route('/:id/save').post(protect, savePost);

module.exports = router;