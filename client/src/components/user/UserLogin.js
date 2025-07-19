import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log(formData);
    setLoading(false);
  };

  // Handle Google OAuth
  const handleGoogleLogin = () => {
    
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-primary-lighter">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card card-custom shadow-lg">
              <div className="card-header card-header-custom text-center">
                <h3 className="mb-0">
                  <i className="fas fa-gavel me-2"></i>
                  Welcome Back
                </h3>
                <p className="mb-0 mt-2 text-light">Sign in to your auction account</p>
              </div>
              
              <div className="card-body p-4">
                {/* Error Alert */}
                {error && (
                  <div className="alert alert-error-custom alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close btn-close-white" 
                      onClick={() => setError('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* OAuth Error from URL */}
                {/* {location.search.includes('error=oauth_failed') && (
                  <div className="alert alert-error-custom" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Google authentication failed. Please try again.
                  </div>
                )} */}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label form-label-custom">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-custom"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label form-label-custom">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-custom"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <Link to="/forgot-password" className="text-primary-custom text-decoration-none">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 mb-3"
                    disabled={loading || !formData.email || !formData.password}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span className="text-muted">or</span>
                  <hr className="my-2" />
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  className="btn google-btn w-100 mb-3"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <i className="fab fa-google me-2 text-danger"></i>
                  Continue with Google
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/signup" className="text-primary-custom text-decoration-none fw-bold">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-3">
              <small className="text-muted">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-primary-custom text-decoration-none">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-custom text-decoration-none">
                  Privacy Policy
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
