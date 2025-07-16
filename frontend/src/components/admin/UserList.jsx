import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchUsers = async () => {
    try {
      setError(null);
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo.token]);

  const deleteHandler = async (id, name, email) => {
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
              Delete User
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              Are you sure you want to delete user <span className="font-medium">"{name}"</span> ({email})? This action cannot be undone.
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
                  confirmDelete(id, name);
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

  const confirmDelete = async (id, name) => {
    setDeleteLoading(id);
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      if (res.ok) {
        setUsers(users.filter(user => user._id !== id));
        toast.success(`User "${name}" deleted successfully! 🗑️`, {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
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
        <p className="text-lg text-base-content/70">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
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
              fetchUsers();
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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                👥 Manage Users
              </h2>
              <p className="text-base-content/70 mt-1">
                {users.length} {users.length === 1 ? 'user' : 'users'} total
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-ghost gap-2"
                onClick={() => {
                  setLoading(true);
                  fetchUsers();
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

          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-base-content/70">Users will appear here once they register!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left">User Details</th>
                    <th className="text-left">Role</th>
                    <th className="text-left">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-base-200/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                              <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{user.name}</div>
                            <div className="text-sm text-base-content/70">{user.email}</div>
                            <div className="text-xs text-base-content/50">
                              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {user.isAdmin ? (
                            <span className="badge badge-warning gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin
                            </span>
                          ) : (
                            <span className="badge badge-ghost gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              User
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="badge badge-success badge-xs"></span>
                            <span>Active</span>
                          </div>
                          {user.savedPosts && (
                            <div className="text-xs text-base-content/50">
                              {user.savedPosts.length} saved posts
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <Link to={`/admin/user/${user._id}/edit`}>
                            <button className="btn btn-sm btn-ghost gap-1 hover:btn-primary transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          </Link>
                          <button
                            className={`btn btn-sm btn-error gap-1 hover:scale-105 transition-all ${deleteLoading === user._id ? 'loading' : ''}`}
                            onClick={() => deleteHandler(user._id, user.name, user.email)}
                            disabled={deleteLoading === user._id || user.isAdmin}
                            title={user.isAdmin ? "Cannot delete admin users" : "Delete user"}
                          >
                            {deleteLoading === user._id ? (
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
};

export default UserList;