import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 flex">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            PixelPulse
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            {userInfo ? (
              <>
                <li>
                  <Link to="/saved-posts">Saved Posts</Link>
                </li>
                {userInfo.isAdmin && (
                  <li>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                )}
                <li>
                  <button onClick={logoutHandler}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/auth" className="btn btn-primary btn-sm">
                  Login/Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;