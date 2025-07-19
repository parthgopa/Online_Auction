import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredAuctions] = useState([
    {
      id: 1,
      title: "Vintage Rolex Submariner",
      currentBid: 15000,
      endTime: "2024-01-20T18:00:00Z",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      category: "Jewelry & Watches",
      bids: 23
    },
    {
      id: 2,
      title: "Original Van Gogh Sketch",
      currentBid: 85000,
      endTime: "2024-01-22T15:30:00Z",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      category: "Art & Collectibles",
      bids: 67
    },
    {
      id: 3,
      title: "1965 Ford Mustang",
      currentBid: 45000,
      endTime: "2024-01-25T20:00:00Z",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop",
      category: "Vehicles",
      bids: 34
    }
  ]);

  const [stats] = useState({
    totalAuctions: 1247,
    activeBidders: 8934,
    totalSold: 156789,
    successRate: 98.5
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate time remaining
  const getTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) return "Ended";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary-custom text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Discover Extraordinary Items at 
                  <span className="text-accent-custom"> AuctionHub</span>
                </h1>
                <p className="lead mb-4">
                  Join thousands of collectors, investors, and enthusiasts in the world's most trusted online auction platform. 
                  Bid on unique items, rare collectibles, and exclusive pieces from around the globe.
                </p>
                <div className="hero-buttons">
                  
                    <div className="d-flex gap-3 flex-wrap">
                      <Link to="/auctions/live" className="btn btn-accent-custom btn-lg">
                        <i className="fas fa-broadcast-tower me-2"></i>
                        Browse Live Auctions
                      </Link>
                      <Link to="/sell" className="btn btn-outline-light btn-lg">
                        <i className="fas fa-plus-circle me-2"></i>
                        Start Selling
                      </Link>
                    </div>
                  
                    <div className="d-flex gap-3 flex-wrap">
                      <Link to="/signup" className="btn btn-accent-custom btn-lg">
                        <i className="fas fa-user-plus me-2"></i>
                        Join Now - It's Free
                      </Link>
                      <Link to="/login" className="btn btn-outline-light btn-lg">
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </Link>
                    </div>
                  
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="auction-preview card-custom bg-white text-dark p-4 shadow-lg">
                  <div className="row align-items-center">
                    <div className="col-4">
                      <img 
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" 
                        alt="Featured Item" 
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-8">
                      <h5 className="mb-2">Vintage Rolex Submariner</h5>
                      <p className="auction-price mb-2">{formatCurrency(15000)}</p>
                      <p className="auction-time mb-2">
                        <i className="fas fa-clock me-1"></i>
                        {getTimeRemaining("2024-01-20T18:00:00Z")} left
                      </p>
                      <span className="badge bg-success">23 bids</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <i className="fas fa-gavel text-primary-custom fs-1 mb-3"></i>
                <h3 className="fw-bold text-primary-custom">{stats.totalAuctions.toLocaleString()}</h3>
                <p className="text-muted">Active Auctions</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <i className="fas fa-users text-secondary-custom fs-1 mb-3"></i>
                <h3 className="fw-bold text-secondary-custom">{stats.activeBidders.toLocaleString()}</h3>
                <p className="text-muted">Active Bidders</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <i className="fas fa-dollar-sign text-accent-custom fs-1 mb-3"></i>
                <h3 className="fw-bold text-accent-custom">{formatCurrency(stats.totalSold)}</h3>
                <p className="text-muted">Total Value Sold</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <i className="fas fa-chart-line text-success fs-1 mb-3"></i>
                <h3 className="fw-bold text-success">{stats.successRate}%</h3>
                <p className="text-muted">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="featured-auctions py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold text-primary-custom mb-3">Featured Auctions</h2>
              <p className="lead text-muted">Don't miss these exclusive items ending soon</p>
            </div>
          </div>
          <div className="row">
            {featuredAuctions.map(auction => (
              <div key={auction.id} className="col-lg-4 col-md-6 mb-4">
                <div className="auction-card">
                  <div className="position-relative">
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <span className="badge bg-secondary-custom position-absolute top-0 end-0 m-2">
                      {auction.category}
                    </span>
                    <div className="position-absolute bottom-0 start-0 m-2">
                      <span className="badge bg-dark bg-opacity-75 text-white">
                        <i className="fas fa-clock me-1"></i>
                        {getTimeRemaining(auction.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title mb-3">{auction.title}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted d-block">Current Bid</small>
                        <span className="auction-price">{formatCurrency(auction.currentBid)}</span>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Bids</small>
                        <span className="fw-bold">{auction.bids}</span>
                      </div>
                    </div>
                    <div className="d-grid">
                      <button className="bid-button">
                        <i className="fas fa-gavel me-2"></i>
                        Place Bid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/auctions" className="btn btn-primary-custom btn-lg">
              <i className="fas fa-eye me-2"></i>
              View All Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold text-primary-custom mb-3">Browse Categories</h2>
              <p className="lead text-muted">Find items that match your interests</p>
            </div>
          </div>
          <div className="row">
            {[
              { name: 'Electronics', icon: 'fas fa-laptop', color: 'primary', count: 234 },
              { name: 'Art & Collectibles', icon: 'fas fa-palette', color: 'warning', count: 567 },
              { name: 'Jewelry & Watches', icon: 'fas fa-gem', color: 'info', count: 189 },
              { name: 'Vehicles', icon: 'fas fa-car', color: 'success', count: 123 },
              { name: 'Antiques', icon: 'fas fa-chess-rook', color: 'secondary', count: 345 },
              { name: 'Sports', icon: 'fas fa-football-ball', color: 'danger', count: 278 }
            ].map((category, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-6 mb-4">
                <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-decoration-none">
                  <div className="category-card card-custom text-center p-4 h-100">
                    <i className={`${category.icon} text-${category.color} fs-1 mb-3`}></i>
                    <h6 className="fw-bold mb-2">{category.name}</h6>
                    <small className="text-muted">{category.count} items</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold text-primary-custom mb-3">How It Works</h2>
              <p className="lead text-muted">Start bidding in three simple steps</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="step-card text-center">
                <div className="step-number bg-primary-custom text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <span className="fs-3 fw-bold">1</span>
                </div>
                <h4 className="fw-bold mb-3">Register & Browse</h4>
                <p className="text-muted">Create your free account and explore thousands of unique items across various categories.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card text-center">
                <div className="step-number bg-secondary-custom text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <span className="fs-3 fw-bold">2</span>
                </div>
                <h4 className="fw-bold mb-3">Place Your Bid</h4>
                <p className="text-muted">Found something you love? Place your bid and track the auction in real-time.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card text-center">
                <div className="step-number bg-accent-custom text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <span className="fs-3 fw-bold">3</span>
                </div>
                <h4 className="fw-bold mb-3">Win & Enjoy</h4>
                <p className="text-muted">Win the auction and enjoy secure payment processing and reliable shipping.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-primary-custom text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Ready to Start Your Auction Journey?</h3>
              <p className="lead mb-0">Join thousands of satisfied buyers and sellers on AuctionHub today.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              
                <Link to="/signup" className="btn btn-accent-custom btn-lg">
                  <i className="fas fa-rocket me-2"></i>
                  Get Started Now
                </Link>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
