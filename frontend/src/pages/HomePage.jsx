import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from '../components/BlogPost';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToLatestPosts = () => {
    const latestPostsSection = document.getElementById('latest-posts');
    if (latestPostsSection) {
      latestPostsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?limit=6');
        const data = await res.json();
        setPosts(data.posts || data); // Handle both new and old API response formats
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-secondary rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-accent rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 border-2 border-primary rounded-lg animate-pulse"></div>
        </div>

        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6 leading-tight">
              What do gamers really want?
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the latest in games and gaming devices
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/blog"
                className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7m0 7H3" />
                </svg>
                Explore Posts
              </Link>
              <button className="btn btn-outline btn-lg gap-2 hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7m0 7H3" />
          </svg>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div id="latest-posts" className="max-w-7xl mx-auto p-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Latest Gaming Posts
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Stay updated with the newest gaming trends, reviews, and insights from our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <BlogPost key={post._id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-base-content/70">Check back soon for the latest gaming content!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;