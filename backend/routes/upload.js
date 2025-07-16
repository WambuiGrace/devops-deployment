const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/upload');

// Upload single image
router.post('/', protect, upload.single('image'), handleUploadError, uploadImage);

// Delete image
router.delete('/:filename', protect, deleteImage);

module.exports = router;
