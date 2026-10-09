import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiCheckSquare,
  FiGrid,
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container header-content">
        {/* Logo */}
        <Link to="/" className="logo">
          <FiCheckSquare size={28} />
          <span>TaskFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <FiGrid size={18} />
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
              >
                <FiCheckSquare size={18} />
                Tasks
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <FiUser size={18} />
                Profile
              </Link>
              <div className="nav-user">
                <span className="nav-user-name">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <FiHome size={18} />
                Home
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="nav-mobile">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiGrid size={18} /> Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="nav-link-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiCheckSquare size={18} /> Tasks
                </Link>
                <Link
                  to="/profile"
                  className="nav-link-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiUser size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="nav-link-mobile logout-btn">
                  <FiLogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="nav-link-mobile" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link
                  to="/login"
                  className="nav-link-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-link-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

