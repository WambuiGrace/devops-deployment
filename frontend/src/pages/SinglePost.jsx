import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${id}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch post');
      }
      
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        const updatedLikes = await res.json();
        setPost(prev => ({ ...prev, likes: updatedLikes }));
        toast.success('Post liked!');
      } else {
        throw new Error('Failed to like post');
      }
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  const handleSave = async () => {
    if (!userInfo) {
      toast.error('Please login to save posts');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        toast.success('Post saved!');
      } else {
        throw new Error('Failed to save post');
      }
    } catch (err) {
      toast.error('Failed to save post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please login to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/posts/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ text: comment }),
      });

      if (res.ok) {
        const updatedComments = await res.json();
        setPost(prev => ({ ...prev, comments: updatedComments }));
        setComment('');
        toast.success('Comment added!');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link to="/blog" className="btn btn-ghost btn-sm">
          ← Back to Blog
        </Link>
      </div>

      {/* Post Header */}
      <article className="card bg-base-100 shadow-xl">
        {post.image && (
          <figure>
            <img 
              src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </figure>
        )}
        
        <div className="card-body">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <span className="badge badge-primary">{post.category}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="card-title text-3xl md:text-4xl font-bold mb-4">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span>By {post.user?.name || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.likes?.length || 0} likes</span>
            <span>•</span>
            <span>{post.comments?.length || 0} comments</span>
          </div>

          {/* Summary */}
          {post.summary && (
            <div className="alert alert-info mb-6">
              <p className="text-lg italic">{post.summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button 
              onClick={handleLike}
              className={`btn ${post.likes?.includes(userInfo?._id) ? 'btn-primary' : 'btn-outline'}`}
              disabled={!userInfo}
            >
              ❤️ Like ({post.likes?.length || 0})
            </button>
            <button 
              onClick={handleSave}
              className="btn btn-outline"
              disabled={!userInfo}
            >
              💾 Save
            </button>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Comments ({post.comments?.length || 0})</h3>

            {/* Add Comment Form */}
            {userInfo ? (
              <form onSubmit={handleComment} className="mb-8">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Add a comment</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="form-control mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingComment}
                  >
                    {submittingComment ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="alert alert-warning mb-8">
                <p>
                  <Link to="/auth" className="link">Login</Link> to add comments
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <div key={index} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SinglePost;