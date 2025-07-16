import { useState } from 'react';
import toast from 'react-hot-toast';
import ImageUpload from '../ImageUpload';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const categories = ['Gaming News', 'Game Reviews', 'Hardware Reviews', 'Gaming Tips', 'Esports', 'Industry News', 'Other'];

  const createPostHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ title, content, image, category }),
      });
      
      if (res.ok) {
        setTitle('');
        setContent('');
        setImage('');
        setCategory('Other');
        toast.success('Post created successfully! 🎉', {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to create post', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Create New Post
            </h2>
            <p className="text-base-content/70 text-lg">Share your thoughts with the world</p>
          </div>
          
          <form onSubmit={createPostHandler} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold flex items-center gap-2">
                  📝 Title
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter an engaging title for your post..."
                className="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold flex items-center gap-2">
                  📂 Category
                </span>
              </label>
              <select
                className="select select-bordered select-lg w-full focus:select-primary transition-all duration-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <label className="label">
                <span className="label-text-alt">Choose the most appropriate category for your post</span>
              </label>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold flex items-center gap-2">
                  ✍️ Content
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered textarea-lg h-40 w-full focus:textarea-primary transition-all duration-300 resize-none"
                placeholder="Write your content here... Share your insights, experiences, or stories."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <label className="label">
                <span className="label-text-alt">Tip: Use clear paragraphs to make your content more readable</span>
              </label>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold flex items-center gap-2">
                  🖼️ Featured Image
                </span>
              </label>
              <ImageUpload 
                onImageUpload={setImage}
                currentImage={image}
              />
            </div>
            
            <div className="divider"></div>
            
            <div className="form-control">
              <button 
                type="submit"
                className={`btn btn-primary btn-lg w-full gap-2 hover:scale-[1.02] transition-all duration-300 ${isSubmitting ? 'loading' : ''}`}
                disabled={!title.trim() || !content.trim() || !image.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Post...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;