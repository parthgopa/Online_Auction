import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

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

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^\w\s]/.test(password)) strength++;
    return strength;
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'First name can only contain letters and spaces';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Last name can only contain letters and spaces';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])/.test(value)) {
          error = 'Password must contain uppercase, lowercase, number, and special character';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    // Update validation errors state
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Clear global error when user starts typing
    if (error === null) {
      setError('');
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    validateField(name, value);

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Validate confirm password when password changes
    if (name === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }

    // Clear global error when user starts typing
  };

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

  // Handle regular form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setError('');
    setSuccess('');

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key]);
      if (fieldErrors) {
        errors[key] = fieldErrors;
      }
    });

    // Check if terms are agreed
    if (!agreeToTerms) {
      errors.terms = 'You must agree to the Terms and Conditions';
    }

    // Check password strength
    if (passwordStrength < 3) {
      errors.password = 'Please choose a stronger password (at least Good strength)';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please fix all validation errors before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...signupData } = formData;
      
      const data = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData)
      });

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess('Account created successfully! Redirecting...');
        
        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/';
          navigate(redirectTo, { replace: true });
        }, 2000);
      }
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google login response:', credentialResponse);
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        
        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/';
          navigate(redirectTo, { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.message.includes('already exists')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else {
        setError(error.message || 'Google signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };


  const handleGoogleError = () => {
    setError('Google login was unsuccessful. Please try again later.');
  };

  // Get password strength color and text
  const getPasswordStrengthInfo = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { color: 'danger', text: 'Weak', width: '20%' };
      case 2:
        return { color: 'warning', text: 'Fair', width: '40%' };
      case 3:
        return { color: 'info', text: 'Good', width: '60%' };
      case 4:
        return { color: 'primary', text: 'Strong', width: '80%' };
      case 5:
        return { color: 'success', text: 'Very Strong', width: '100%' };
      default:
        return { color: 'secondary', text: '', width: '0%' };
    }
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card card-custom shadow-lg">
              <div className="card-header card-header-custom text-center">
                <h3 className="mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Join AuctionHub
                </h3>
                <p className="mb-0 mt-2 text-light">Create your free auction account</p>
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
                      //   onClick={clearError}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* OAuth Error from URL */}
                {location.search.includes('error=oauth_failed') && (
                  <div className="alert alert-error-custom" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Google authentication failed. Please try again.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label form-label-custom">
                        <i className="fas fa-user me-2"></i>
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-custom ${validationErrors.firstName ? 'is-invalid' : ''
                          }`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                        autoComplete="given-name"
                      />
                      {validationErrors.firstName && (
                        <div className="invalid-feedback">
                          {validationErrors.firstName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label form-label-custom">
                        <i className="fas fa-user me-2"></i>
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-custom ${validationErrors.lastName ? 'is-invalid' : ''
                          }`}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                        autoComplete="family-name"
                      />
                      {validationErrors.lastName && (
                        <div className="invalid-feedback">
                          {validationErrors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label form-label-custom">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-custom ${validationErrors.email ? 'is-invalid' : ''
                        }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">
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
                        className={`form-control form-control-custom ${validationErrors.password ? 'is-invalid' : ''
                          }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        autoComplete="new-password"
                      />

                    </div>
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.password}
                      </div>
                    )}

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password Strength:</small>
                          <small className={`text-${strengthInfo.color} fw-bold`}>
                            {strengthInfo.text}
                          </small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${strengthInfo.color}`}
                            style={{ width: strengthInfo.width }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label form-label-custom">
                      <i className="fas fa-lock me-2"></i>
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control form-control-custom ${validationErrors.confirmPassword ? 'is-invalid' : ''
                          }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        autoComplete="new-password"
                      />

                    </div>
                    {validationErrors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className={`form-check-input ${validationErrors.terms ? 'is-invalid' : ''
                          }`}
                        type="checkbox"
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => {
                          setAgreeToTerms(e.target.checked);
                          if (e.target.checked && validationErrors.terms) {
                            const errors = { ...validationErrors };
                            delete errors.terms;
                            setValidationErrors(errors);
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor="agreeToTerms">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary-custom text-decoration-none" target="_blank">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary-custom text-decoration-none" target="_blank">
                          Privacy Policy
                        </Link>
                      </label>
                      {validationErrors.terms && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.terms}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 mb-3"
                    disabled={loading || Object.keys(validationErrors).length > 0 || !agreeToTerms}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
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
                        text="signup_with"
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        disabled={loading || isSubmitting}
                      />
                    </div>
                  </div>
                </GoogleOAuthProvider>

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-primary-custom text-decoration-none fw-bold">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-3">
              <small className="text-muted">
                By creating an account, you agree to receive promotional emails and auction updates.
                You can unsubscribe at any time.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;