import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../Components/Dashboard Pages/Navbar';
import Sidebar from '../Components/Dashboard Pages/Sidebar';
import { ChangePasswordModal, DeleteAccountModal } from '../Components/Profile';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { member, updateMemberInfo } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(member?.customFields?.['first-name'] || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarNavigate = (path) => {
    navigate(path);
  };

  const handleSaveName = async () => {
    setNameLoading(true);
    try {
      const result = await updateMemberInfo({ 'first-name': firstName });
      if (result.success) {
        setNameSuccess(true);
        setIsEditingName(false);
        setTimeout(() => setNameSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setNameLoading(false);
    }
  };

  const userEmail = member?.auth?.email || 'No email';
  const userName = member?.customFields?.['first-name'] || 'Not set';

  return (
    <div className="page-wrapper">
      <div className="main-wrapper is-dashboard">
        <Sidebar isOpen={isSidebarOpen} onNavigate={handleSidebarNavigate} activePage="profile" />
        <div className="dashboard_main_wrapper">
          <Navbar onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
          <div className="dashboard_main_app">
            {/* Page Header */}
            <div>
              <h1 className="text-size-xlarge text-weight-semibold" style={{ marginBottom: '0.5rem' }}>
                Profile Settings
              </h1>
              <p className="text-size-regular text-color-secondary">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Profile Content */}
            <div style={{ maxWidth: '800px' }}>
              
              {/* Personal Information Section */}
              <div className="card_app_wrapper" style={{ marginBottom: '1.25rem' }}>
                <div className="card_app_header">
                  <h2 className="text-size-large text-weight-semibold">Personal Information</h2>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  {/* First Name */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingBottom: '1rem',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="text-size-medium text-weight-medium" style={{ marginBottom: '0.25rem' }}>
                        First Name
                      </div>
                      {isEditingName ? (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          <input
                            type="text"
                            className="main_form_input w-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            style={{ maxWidth: '250px' }}
                          />
                          <button 
                            onClick={handleSaveName}
                            className="button is-small"
                            disabled={nameLoading}
                          >
                            {nameLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditingName(false);
                              setFirstName(member?.customFields?.['first-name'] || '');
                            }}
                            className="button is-secondary is-small"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="text-size-regular text-color-secondary">{userName}</span>
                          {nameSuccess && (
                            <span className="text-size-small" style={{ color: '#26a69a' }}>✓ Saved</span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isEditingName && (
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="button is-secondary is-small"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Login and Security Section */}
              <div className="card_app_wrapper" style={{ marginBottom: '1.25rem' }}>
                <div className="card_app_header">
                  <h2 className="text-size-large text-weight-semibold">Login and Security</h2>
                </div>
                <div style={{ padding: '0' }}>
                  {/* Password */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border-color--border-primary)'
                    }}
                  >
                    <div>
                      <div className="text-size-medium text-weight-medium" style={{ marginBottom: '0.25rem' }}>
                        Password
                      </div>
                      <div className="text-size-regular text-color-secondary">
                        Update your password and secure your account.
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="button is-secondary is-small"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1.25rem',
                    }}
                  >
                    <div>
                      <div className="text-size-medium text-weight-medium" style={{ marginBottom: '0.25rem', color: '#ef5350' }}>
                        Delete Account
                      </div>
                      <div className="text-size-regular text-color-secondary">
                        This account will no longer be available, and all your saved data will be permanently deleted.
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="button is-small"
                      style={{ 
                        backgroundColor: '#ef5350',
                        borderColor: '#ef5350',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Info Section */}
              <div className="card_app_wrapper">
                <div className="card_app_header">
                  <h2 className="text-size-large text-weight-semibold">Account Information</h2>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <div className="text-size-small text-color-secondary" style={{ marginBottom: '0.25rem' }}>
                        Member ID
                      </div>
                      <div className="text-size-regular text-weight-medium">
                        {member?.id || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-size-small text-color-secondary" style={{ marginBottom: '0.25rem' }}>
                        Account Status
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: '#26a69a' 
                          }} 
                        />
                        <span className="text-size-regular text-weight-medium" style={{ color: '#26a69a' }}>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </div>
  );
}
