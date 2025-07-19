import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const navigate = useNavigate();
  const location = useLocation();

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Handle login attempt blocking (security measure)
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      setError('Too many failed login attempts. Please wait 15 minutes before trying again.');
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
        setError('');
      }, 15 * 60 * 1000); // 15 minutes
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error when user starts typing
    if (error) setError('');
  };

  // Handle regular form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || isBlocked) return;
    
    setError('');
    setSuccess('');
    
    // Validation
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix all validation errors before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe
        })
      });

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess(`Welcome back ${data.user.firstName}! Redirecting...`);
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        
        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/';
          navigate(redirectTo, { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Increment login attempts on failure
      setLoginAttempts(prev => prev + 1);
      
      if (error.message.includes('Invalid credentials') || error.message.includes('User not found')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Account deactivated')) {
        setError('Your account has been deactivated. Please contact support.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google login response:', credentialResponse);
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await apiCall('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.isNewUser) {
          setSuccess(`Welcome ${data.user.firstName}! Your account has been created successfully. Redirecting...`);
        } else {
          setSuccess(`Welcome back ${data.user.firstName}! Redirecting...`);
        }
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        
        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/';
          navigate(redirectTo, { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    setError('Google login was unsuccessful. Please try again later.');
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
                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSuccess('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

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

                {/* Login Attempts Warning */}
                {loginAttempts >= 3 && loginAttempts < 5 && (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Warning: {5 - loginAttempts} login attempts remaining before temporary lockout.
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
                      className={`form-control form-control-custom ${
                        validationErrors.email ? 'is-invalid' : ''
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      disabled={isBlocked}
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.email}
                      </div>
                    )}
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
                        className={`form-control form-control-custom ${
                          validationErrors.password ? 'is-invalid' : ''
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        disabled={isBlocked}
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
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.password}
                      </div>
                    )}
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
                    disabled={loading || isSubmitting || isBlocked || !formData.email || !formData.password}
                  >
                    {loading || isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing In...
                      </>
                    ) : isBlocked ? (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Account Temporarily Locked
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
                <GoogleOAuthProvider clientId={googleClientId}>
                  <div className="d-flex justify-content-center mb-3">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        disabled={isBlocked || isSubmitting}
                        text="continue_with"
                        shape="rectangular"
                        theme="outline"
                        size="large"
                      />
                    </div>
                  </div>
                </GoogleOAuthProvider>

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
