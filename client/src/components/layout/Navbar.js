import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaHammer, FaBroadcastTower,FaClock, FaFlagCheckered, FaPalette, FaGem, FaTags, FaThLarge, FaSearch, FaHome, FaLaptop, FaBell, FaUser, FaHeart, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaHandPaper, FaPlusCircle, FaExclamationTriangle, FaGavel, FaQuestionCircle, FaChessRook, FaFootballBall, FaCar } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-expand-sm navbar-expand-md navbar-expand-xl navbar-custom fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand navbar-brand-custom d-flex align-items-center" to="/">
          <FaGavel className="me-2 text-accent-custom" />
          <span className="fw-bold">AuctionHub</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars className="text-white" />
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">
                <FaHome className="me-1" />
                Home
              </Link>
            </li>

            {/* Auctions Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-link-custom dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaHammer me-1 />   
                Auctions
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li>
                  <Link className="dropdown-item" to="/auctions/live">
                    <FaBroadcastTower me-2 text-danger />
                    Live Auctions
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/auctions/upcoming">
                    <FaClock me-2 text-warning />
                    Upcoming Auctions
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/auctions/ended">
                    <FaFlagCheckered me-2 text-success />
                    Ended Auctions
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/auctions/categories">
                    <FaTags me-2 text-info />
                    Browse Categories
                  </Link>
                </li>
              </ul>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-link-custom dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaThLarge className="me-1" />
                Categories
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li>
                  <Link className="dropdown-item" to="/category/electronics">
                    <FaLaptop me-2 text-primary />
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/art">
                    <FaPalette me-2 text-warning />
                    Art & Collectibles
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/jewelry">
                    <FaGem me-2 text-info />
                    Jewelry & Watches
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/vehicles">
                    <FaCar me-2 text-success />
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/antiques">
                    <FaChessRook me-2 text-secondary />
                    Antiques
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/sports">
                    <FaFootballBall me-2 text-danger />
                    Sports Memorabilia
                  </Link>
                </li>
              </ul>
            </li>

            {/* How It Works */}
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/how-it-works">
                <FaQuestionCircle className="me-1" />
                How It Works
              </Link>
            </li>
          </ul>

          {/* Right Side Navigation */}
          <ul className="navbar-nav">
            {/* Search */}
            <li className="nav-item me-2">
              <form className="d-flex" role="search">
                <div className="input-group">
                  <input
                    className="form-control form-control-sm"
                    type="search"
                    placeholder="Search auctions..."
                    aria-label="Search"
                    style={{ minWidth: '200px' }}
                  />
                  <button className="btn btn-accent-custom btn-sm" type="submit">
                    <FaSearch />
                  </button>
                </div>
              </form>
            </li>

            {/* Notifications (if authenticated) */}
            
              <li className="nav-item dropdown me-2">
                <a
                  className="nav-link nav-link-custom position-relative"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaBell className="me-1"/>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                    <span className="visually-hidden">unread notifications</span>
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                  <li>
                    <h6 className="dropdown-header">Notifications</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaGavel className="me-2 text-success" />
                      You won the vintage watch auction!
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaExclamationTriangle className="me-2 text-warning" />
                      Auction ending in 5 minutes
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaPlusCircle className="me-2 text-info" />
                      New auction in your category
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item text-center" to="/notifications">
                      View All Notifications
                    </Link>
                  </li>
                </ul>
              </li>
            

            {/* User Authentication */}
            <li className="nav-item dropdown">
                <a
                  className="nav-link nav-link-custom dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  
                      <span className="d-none d-md-inline">User</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                  <li>
                    <h6 className="dropdown-header">
                      User
                    </h6>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <FaTachometerAlt className="me-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser className="me-2" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-bids">
                      <FaHandPaper className="me-2" />
                      My Bids
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-auctions">
                      <FaGavel className="me-2" />
                      My Auctions
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/watchlist">
                      <FaHeart className="me-2" />
                      Watchlist
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/sell">
                      <FaPlusCircle className="me-2 text-success" />
                      Sell an Item
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <FaCog className="me-2" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-light btn-sm" to="/login">
                    <FaSignInAlt className="me-1" />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-accent-custom btn-sm" to="/signup">
                    <FaUserPlus className="me-1" />
                    Sign Up
                  </Link>
                </li>
              </>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
