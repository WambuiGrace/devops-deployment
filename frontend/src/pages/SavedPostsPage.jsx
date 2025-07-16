import { useEffect, useState } from 'react';
import BlogPost from '../components/BlogPost';

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo) {
        setError('Please login to view saved posts');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/users/saved', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch saved posts');
        }
        
        const data = await res.json();
        setSavedPosts(data);
      } catch (err) {
        setError('Failed to fetch saved posts');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  const handleSaveToggle = (postId, isSaved) => {
    if (!isSaved) {
      // Remove post from saved posts if it was unsaved
      setSavedPosts(savedPosts.filter(post => post._id !== postId));
    }
  };

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Saved Posts</h1>
      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPosts.map((post) => (
            <BlogPost key={post._id} post={post} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      ) : (
        <p>You have no saved posts.</p>
      )}
    </div>
  );
};

export default SavedPostsPage;