import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const categories = ['Gaming News', 'Game Reviews', 'Hardware Reviews', 'Gaming Tips', 'Esports', 'Industry News', 'Other'];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setImage(data.image);
        setCategory(data.category || 'Other');
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ title, content, image, category }),
      });
      
      if (res.ok) {
        toast.success('Post updated successfully! 🎉', {
          duration: 4000,
          position: 'top-center',
        });
        setTimeout(() => {
          navigate('/admin/dashboard/posts');
        }, 1500);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update post', {
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

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-lg text-base-content/70">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="alert alert-error">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
        <Link to="/admin/dashboard/posts" className="btn btn-primary mt-4">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link 
          to="/admin/dashboard/posts" 
          className="btn btn-ghost gap-2 hover:btn-primary transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Edit Post
            </h1>
            <p className="text-base-content/70 text-lg">Make your content even better</p>
          </div>
          
          <form onSubmit={submitHandler} className="space-y-6">
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
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={isSubmitting}
              />
              <label className="label">
                <span className="label-text-alt">Add a compelling image to make your post stand out</span>
              </label>
              {image && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Preview:</div>
                  <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-base-300">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="divider"></div>
            
            <div className="flex gap-4">
              <button 
                type="submit"
                className={`btn btn-primary btn-lg flex-1 gap-2 hover:scale-[1.02] transition-all duration-300 ${isSubmitting ? 'loading' : ''}`}
                disabled={!title.trim() || !content.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating Post...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Post
                  </>
                )}
              </button>
              <Link 
                to="/admin/dashboard/posts"
                className={`btn btn-outline btn-lg gap-2 hover:scale-[1.02] transition-all duration-300 ${isSubmitting ? 'btn-disabled' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostEditPage;