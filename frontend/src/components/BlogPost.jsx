import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BlogPost = ({ post, onSaveToggle }) => {
  const {
    image,
    title,
    content,
    summary,
    user,
    createdAt,
    category,
    _id,
  } = post;

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Use provided summary or generate from content
  const displaySummary = summary || (content ? content.substring(0, 150) + '...' : '');

  // Check if post is already saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!userInfo) return;

      try {
        const res = await fetch('/api/users/saved', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        if (res.ok) {
          const savedPosts = await res.json();
          setIsSaved(savedPosts.some(savedPost => savedPost._id === _id));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkSavedStatus();
  }, [_id, userInfo]);

  const handleSave = async () => {
    if (!userInfo) {
      toast.error('Please login to save posts');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${_id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        
        // Notify parent component if callback is provided
        if (onSaveToggle) {
          onSaveToggle(_id, newSavedState);
        }
        
        // Show success toast
        if (isSaved) {
          toast.error('Post removed from saved posts');
        } else {
          toast.success('Post saved successfully!');
        }
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img src={image} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{displaySummary}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{user?.name}</div>
          <div className="badge badge-outline">
            {new Date(createdAt).toLocaleDateString()}
          </div>
          {category && (
            <div className="badge badge-primary">
              {category}
            </div>
          )}
        </div>
        <div className="card-actions justify-end">
          <Link to={`/blog/${_id}`} className="btn btn-primary">
            Read More
          </Link>
          {userInfo && (
            <button 
              className={`btn ${isSaved ? 'btn-success' : 'btn-secondary'} ${isLoading ? 'loading' : ''}`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;