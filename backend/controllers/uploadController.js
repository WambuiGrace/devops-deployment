const path = require('path');
const fs = require('fs');

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file path that can be used in the frontend
    const imagePath = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: imagePath,
        url: `${req.protocol}://${req.get('host')}${imagePath}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage
};
