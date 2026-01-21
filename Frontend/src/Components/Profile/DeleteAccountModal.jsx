import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ModalWrapper from '../Memberstack/ModalWrapper';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { deleteMemberAccount, member } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get user's full name and replace spaces with dashes
  const userFullName = member?.customFields?.['first-name'] || 'User';
  const requiredText = userFullName.replace(/\s+/g, '-');
  
  console.log('[DeleteAccount] User full name:', userFullName);
  console.log('[DeleteAccount] Required confirmation text:', requiredText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (confirmText !== requiredText) {
      setError(`Please type "${requiredText}" to confirm.`);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to delete account...');
      const result = await deleteMemberAccount();
      console.log('Delete account result:', result);
      
      if (result.success) {
        navigate('/');
      } else {
        // Check if it's a Memberstack restriction error
        if (result.error?.includes('contact') || result.error?.includes('owner') || result.error?.includes('disabled')) {
          setError('Account deletion is currently disabled. This feature can be enabled in your Memberstack dashboard under Settings > General > Member Self-Service.');
        } else {
          setError(result.error || 'Failed to delete account.');
        }
      }
    } catch (err) {
      console.error('Delete account error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose}>
      <div className="main_form_block w-form" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="main_form">
          <div className="main_form_header">
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="heading-style-h3" style={{ color: '#ef5350' }}>Delete Account</h2>
            <p className="text-size-regular text-color-secondary" style={{ marginTop: '0.5rem' }}>
              This action is <strong>permanent and cannot be undone</strong>. All your data will be permanently deleted.
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: '0.75rem', 
              marginBottom: '1rem', 
              backgroundColor: 'rgba(239, 83, 80, 0.1)', 
              color: '#ef5350', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              border: '1px solid rgba(239, 83, 80, 0.2)'
            }}>
              {error}
            </div>
          )}

          <div className="main_form_fields_wrapper">
            <div className="main_form_fields">
              <label htmlFor="confirmText" className="main_form_label">
                Type <strong style={{ color: '#ef5350' }}>"{requiredText}"</strong> to confirm
              </label>
              <input
                className="main_form_input w-input"
                name="confirmText"
                placeholder={`Type ${requiredText} here`}
                type="text"
                id="confirmText"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  if (error) setError('');
                }}
                required
                style={{
                  borderColor: confirmText && confirmText !== requiredText ? '#ef5350' : undefined
                }}
              />
              <p className="text-size-tiny text-color-secondary" style={{ marginTop: '0.5rem' }}>
                Use dashes instead of spaces
              </p>
            </div>
          </div>

          <div className="main_form_footer" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="button is-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button"
              style={{ 
                flex: 1, 
                backgroundColor: '#ef5350',
                opacity: confirmText !== requiredText ? 0.5 : 1
              }}
              disabled={isLoading || confirmText !== requiredText}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>

          <div 
            className="main_form_close_button" 
            onClick={handleClose} 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="https://cdn.prod.website-files.com/69284f1f4a41d1c19de618ec/696807b39a055f53b4271712_close_black_24dp.svg" 
              loading="lazy" 
              alt="Close" 
              className="main_form_close_icon" 
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default DeleteAccountModal;
