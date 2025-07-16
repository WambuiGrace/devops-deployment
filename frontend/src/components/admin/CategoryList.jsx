import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchCategories = async () => {
    try {
      setError(null);
      const res = await fetch('/api/categories?active=all', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userInfo.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || `Category ${editingCategory ? 'updated' : 'created'} successfully! 🎉`);
        setFormData({ name: '', description: '', color: '#3B82F6' });
        setShowCreateForm(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(data.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6'
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id, name) => {
    toast.custom((t) => (
      <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base-content">Delete Category</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  setDeleteLoading(id);
                  try {
                    const res = await fetch(`/api/categories/${id}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                      },
                    });
                    
                    if (res.ok) {
                      setCategories(categories.filter(category => category._id !== id));
                      toast.success('Category deleted successfully! 🗑️');
                    } else {
                      const data = await res.json();
                      toast.error(data.message || 'Failed to delete category');
                    }
                  } catch (err) {
                    toast.error('Failed to delete category');
                  } finally {
                    setDeleteLoading(null);
                  }
                }}
                className="btn btn-error btn-sm"
                disabled={deleteLoading === id}
              >
                {deleteLoading === id ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-base-content/70 mt-2">Manage blog post categories</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showCreateForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Color</span>
                </label>
                <input
                  type="color"
                  className="input input-bordered w-20 h-12"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Categories ({categories.length})</h2>
          
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
              <p className="text-base-content/70">Create your first category to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Color</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-base-200/50">
                      <td>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm text-base-content/70">{category.slug}</div>
                      </td>
                      <td>
                        <div className="max-w-xs truncate">
                          {category.description || 'No description'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-base-300"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-sm">{category.color}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`badge ${category.isActive ? 'badge-success' : 'badge-error'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="btn btn-sm btn-ghost"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(category._id, category.name)}
                            className="btn btn-sm btn-ghost text-error hover:btn-error"
                            disabled={deleteLoading === category._id}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
};

export default CategoryList;
