import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = ({ onClose, showCloseButton = true }) => {
  const navigate = useNavigate();
  const { signup, signupWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
    capital: false
  });

  // Add styles for autofill
  const autofillStyles = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
      box-shadow: 0 0 0 30px #f5f5f5 inset !important;
      -webkit-text-fill-color: #000 !important;
    }
  `;

  useEffect(() => {
    // Validate password requirements
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      capital: /[A-Z]/.test(password)
    });
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password meets all requirements
    const allValid = Object.values(passwordValidation).every(v => v);
    if (!allValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signup(formData.email, formData.password, {
        'first-name': formData.name
      });
      
      if (result.success) {
        if (onClose) onClose();
        navigate('/app');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signupWithGoogle();
      
      if (result.success) {
        if (onClose) onClose();
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google signup failed.');
      }
    } catch (err) {
      setError('Google signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{autofillStyles}</style>
      <div className="main_form_block w-form">
        <form onSubmit={handleSubmit} className="main_form" data-ms-form="signup">
          <h1 className="heading-style-h3">Signup</h1>
          
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              marginBottom: '1rem', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          
          <div className="main_form_fields_wrapper">
            <div className="main_form_fields">
              <label htmlFor="Name-Two-2" className="main_form_label">
                Name
              </label>
              <input
                className="main_form_input w-input"
                maxLength="256"
                name="name"
                placeholder="e.g. Howard Thurman"
                type="text"
                id="Name-Two-2"
                value={formData.name}
                onChange={handleChange}
                data-ms-member="first-name"
                required
              />
            </div>
            <div className="main_form_fields">
              <label htmlFor="Email-One-2" className="main_form_label">
                Email Address
              </label>
              <input
                className="main_form_input w-input"
                maxLength="256"
                name="email"
                placeholder="e.g. howard@gmail.com"
                type="email"
                id="Email-One-2"
                value={formData.email}
                onChange={handleChange}
                data-ms-member="email"
                required
              />
            </div>
            <div className="main_form_fields">
              <label htmlFor="Password-One-2" className="main_form_label">
                Password Input
              </label>
              <input
                className="main_form_input w-input"
                maxLength="256"
                name="password"
                placeholder="⁕ ⁕ ⁕ ⁕ ⁕ ⁕ ⁕ ⁕"
                type="password"
                id="Password-One-2"
                value={formData.password}
                onChange={handleChange}
                data-ms-member="password"
                required
              />
              <div className="update_password-check">
                <div className="text-size-small text-color-secondary text-weight-semibold">
                  Your password must contains:
                </div>
                <ul role="list" className="login-list">
                  <li
                    id="length-6"
                    className="password-requirements"
                  >
                    A minimum of 8 characters.
                  </li>
                  <li
                    id="number-6"
                    className="password-requirements"
                  >
                    At least one number
                  </li>
                  <li
                    id="special-6"
                    className="password-requirements"
                  >
                    At least 1 special character
                  </li>
                  <li
                    id="capital-6"
                    className="password-requirements"
                  >
                    At least one uppercase letter
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="main_form_footer">
            <input 
              type="submit" 
              data-wait="Please wait..." 
              className="button is-full-width w-button"
              value={isLoading ? 'Please wait...' : 'Submit'}
              disabled={isLoading}
            />
          </div>
          
          {showCloseButton && (
            <div className="main_form_close_button" onClick={onClose} style={{ cursor: 'pointer' }}>
              <img src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696807b39a055f53b4271712_close_black_24dp.svg" loading="lazy" alt="" className="main_form_close_icon" />
            </div>
          )}
        </form>
        <div className="w-form-done">
          <div>Thank you! Your submission has been received!</div>
        </div>
        <div className="w-form-fail">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
    </div>
    </>
  );
};

export default SignUp;
