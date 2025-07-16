import { useState } from 'react';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageUpload, currentImage, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Image uploaded successfully! 📸');
        onImageUpload(data.data.url);
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/70">Current Image:</label>
          <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden border-2 border-base-300">
            <img 
              src={currentImage} 
              alt="Current preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-base-300 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="space-y-4">
            {uploading ? (
              <>
                <div className="loading loading-spinner loading-lg text-primary mx-auto"></div>
                <p className="text-base-content/70">Uploading image...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-base-content">
                    Drop your image here, or{' '}
                    <span className="text-primary hover:text-primary/80">browse</span>
                  </p>
                  <p className="text-sm text-base-content/70 mt-1">
                    Supports: JPEG, PNG, GIF, WebP (Max: 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Alternative: URL Input */}
      <div className="divider">OR</div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Image URL</span>
        </label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          className="input input-bordered w-full"
          onChange={(e) => onImageUpload(e.target.value)}
          disabled={uploading}
        />
        <label className="label">
          <span className="label-text-alt">Or paste an image URL directly</span>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
