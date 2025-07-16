import { Link, Outlet } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <div className="tabs">
        <Link to="users" className="tab tab-lifted">
          Users
        </Link>
        <Link to="posts" className="tab tab-lifted">
          Posts
        </Link>
        <Link to="categories" className="tab tab-lifted">
          Categories
        </Link>
        <Link to="create-post" className="tab tab-lifted">
          Create Post
        </Link>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardPage;