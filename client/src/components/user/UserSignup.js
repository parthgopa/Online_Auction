import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

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

//   const { signup, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    const errors = { ...validationErrors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        } else {
          delete errors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };

  // Handle form input changes
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!agreeToTerms) {
      setValidationErrors(prev => ({
        ...prev,
        terms: 'You must agree to the Terms of Service and Privacy Policy'
      }));
      return;
    }

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...signupData } = formData;
    setLoading(true);

    console.log(signupData);
    setLoading(false);
  };

  // Handle Google OAuth
  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
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
                        className={`form-control form-control-custom ${
                          validationErrors.firstName ? 'is-invalid' : ''
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
                        className={`form-control form-control-custom ${
                          validationErrors.lastName ? 'is-invalid' : ''
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
                        className={`form-control form-control-custom ${
                          validationErrors.password ? 'is-invalid' : ''
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
                        className={`form-control form-control-custom ${
                          validationErrors.confirmPassword ? 'is-invalid' : ''
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
                        className={`form-check-input ${
                          validationErrors.terms ? 'is-invalid' : ''
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
                <button
                  type="button"
                  className="btn google-btn w-100 mb-3"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <i className="fab fa-google me-2 text-danger"></i>
                  Sign up with Google
                </button>

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