import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchPosts = async () => {
    try {
      setError(null);
      const res = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        // Handle both new pagination format and old format
        const postsData = data.posts || data;
        setPosts(Array.isArray(postsData) ? postsData : []);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userInfo.token]);

  const deleteHandler = async (id, title) => {
    // Create a custom toast with confirmation buttons
    toast.custom((t) => (
      <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base-content mb-1">
              Delete Post
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              Are you sure you want to delete <span className="font-medium">"{title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error gap-1"
                onClick={() => {
                  toast.dismiss(t.id);
                  confirmDelete(id, title);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const confirmDelete = async (id, title) => {
    setDeleteLoading(id);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        setPosts(posts.filter(post => post._id !== id));
        toast.success(`"${title}" deleted successfully! 🗑️`, {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-lg text-base-content/70">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="alert alert-error">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchPosts();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {message.text && (
        <div className={`alert mb-6 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
          <span>{message.text}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setMessage({ type: '', text: '' })}
          >
            ✕
          </button>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                📝 Manage Posts
              </h2>
              <p className="text-base-content/70 mt-1">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-ghost gap-2"
                onClick={() => {
                  setLoading(true);
                  fetchPosts();
                }}
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {!Array.isArray(posts) || posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-base-content/70">Create your first post to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Post Details</th>
                    <th className="text-left">Author</th>
                    <th className="text-left">Stats</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(posts) && posts.map((post) => (
                    <tr key={post._id} className="hover:bg-base-200/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img 
                                  src={post.image} 
                                  alt={post.title}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-lg">{post.title}</div>
                            <div className="text-sm text-base-content/70 flex items-center gap-2">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              {post.category && (
                                <>
                                  <span>•</span>
                                  <span className="badge badge-sm badge-outline">{post.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                              <span className="text-xs">{post.user?.name?.charAt(0) || 'A'}</span>
                            </div>
                          </div>
                          <span className="font-medium">{post.user?.name || 'Admin'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span>❤️ {post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>💬 {post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <Link to={`/admin/post/${post._id}/edit`}>
                            <button className="btn btn-sm btn-ghost gap-1 hover:btn-primary transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          </Link>
                          <button
                            className={`btn btn-sm btn-error gap-1 hover:scale-105 transition-all ${deleteLoading === post._id ? 'loading' : ''}`}
                            onClick={() => deleteHandler(post._id, post.title)}
                            disabled={deleteLoading === post._id}
                          >
                            {deleteLoading === post._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostList;