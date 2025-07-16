import { useState, useEffect } from 'react';
import BlogPost from '../components/BlogPost';
import toast from 'react-hot-toast';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [categories, setCategories] = useState(['All', 'Gaming News', 'Game Reviews', 'Hardware Reviews', 'Gaming Tips', 'Esports', 'Industry News', 'Other']);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          const categoryNames = data.data.map(cat => cat.name);
          setCategories(['All', ...categoryNames]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Keep default categories if API fails
      }
    };

    fetchCategories();
  }, []);

  const fetchPosts = async (page = 1, search = '', category = 'All', sort = 'createdAt', order = 'desc') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        sortBy: sort,
        order: order
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (category !== 'All') {
        params.append('category', category);
      }

      const res = await fetch(`/api/posts?${params}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await res.json();
      
      // Handle both new pagination format and old format
      if (data.posts) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        setPosts(data);
        setPagination({});
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, selectedCategory, sortBy, sortOrder);
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchTerm, selectedCategory, sortBy, sortOrder);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy, newOrder = sortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Gaming Blog Posts
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Explore the latest gaming content, reviews, tips, and industry news
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-base-200 rounded-lg p-6 mb-8 max-w-5xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts by title, content, or summary..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-base-content/70 mb-3">FILTER BY CATEGORY</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`btn btn-sm ${
                  selectedCategory === category
                    ? 'btn-primary'
                    : 'btn-outline btn-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <h3 className="text-sm font-semibold text-base-content/70">SORT BY:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSortChange('createdAt', 'desc')}
              className={`btn btn-sm ${
                sortBy === 'createdAt' && sortOrder === 'desc'
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => handleSortChange('createdAt', 'asc')}
              className={`btn btn-sm ${
                sortBy === 'createdAt' && sortOrder === 'asc'
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              Oldest First
            </button>
            <button
              onClick={() => handleSortChange('title', 'asc')}
              className={`btn btn-sm ${
                sortBy === 'title'
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              Title A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {pagination.totalPosts !== undefined && (
        <div className="mb-6 text-base-content/70">
          <p>
            Showing {posts.length} of {pagination.totalPosts} posts
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && (
        <>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
              {posts.map((post) => (
                <BlogPost key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-base-content/70 mb-4">
                {searchTerm || selectedCategory !== 'All'
                  ? 'Try adjusting your search terms or filters'
                  : 'Check back soon for the latest gaming content!'}
              </p>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  «
                </button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className="join-item">
                      {/* Add ellipsis if there's a gap */}
                      {index > 0 && page - array[index - 1] > 1 && (
                        <button className="btn btn-disabled join-item">...</button>
                      )}
                      <button
                        className={`join-item btn ${
                          currentPage === page ? 'btn-active' : ''
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </div>
                  ))}

                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;