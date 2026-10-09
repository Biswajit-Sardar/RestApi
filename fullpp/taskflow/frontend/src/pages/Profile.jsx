import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiTrash2,
  FiCalendar,
} from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const { data } = await userAPI.updateProfile(profileData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoadingPassword(true);

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your tasks will be permanently deleted.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This is your last chance. Your account and all data will be permanently deleted. Continue?'
    );

    if (!doubleConfirm) return;

    try {
      await userAPI.deleteAccount();
      await logout();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {/* User Info */}
      <div className="profile-info-card">
        <div className="profile-avatar">
          <FiUser size={48} />
        </div>
        <div className="profile-details">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <p className="text-muted">
            <FiCalendar size={14} /> Member since{' '}
            {user?.createdAt
              ? format(new Date(user.createdAt), 'MMMM yyyy')
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Update Profile Form */}
      <div className="profile-section">
        <h2>Update Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <FiUser size={16} /> Name
            </label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FiMail size={16} /> Email
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingProfile}
          >
            {loadingProfile ? (
              <Spinner size={18} color="#fff" />
            ) : (
              <>
                <FiSave size={16} /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="profile-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">
              <FiLock size={16} /> Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              <FiLock size={16} /> New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="form-input"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">
              <FiLock size={16} /> Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="form-input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingPassword}
          >
            {loadingPassword ? (
              <Spinner size={18} color="#fff" />
            ) : (
              <>
                <FiLock size={16} /> Change Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="profile-section danger-zone">
        <h2>Danger Zone</h2>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          <FiTrash2 size={16} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;

