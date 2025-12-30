import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateUserRole, deleteUser } from '../../api.js';
import './Admin.css';

const UserCard = ({ user, onUserUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole) => {
    try {
      setIsLoading(true);
      await updateUserRole(user._id, newRole);
      if (onUserUpdate) {
        onUserUpdate();
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.name || user.email}?`)) {
      try {
        setIsLoading(true);
        await deleteUser(user._id);
        if (onUserUpdate) {
          onUserUpdate();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="user-card">
      <div className="user-main">
        <div className="user-info">
          <div className="user-header">
            <h4 className="user-name">
              {user.fullName || user.name || user.email}
            </h4>
            <span className={`user-role ${user.role}`}>
              {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
            </span>
          </div>
          
          <div className="user-details">
            <div className="detail-item">📧 {user.email}</div>
            {user.phone && <div className="detail-item">📱 {user.phone}</div>}
            {user.location && <div className="detail-item">📍 {user.location}</div>}
          </div>
          
          <div className="user-joined">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </div>

          {isExpanded && (
            <div className="user-extended">
              <div className="extended-grid">
                {user.city && (
                  <div>
                    <span className="ext-label">City:</span>
                    <span className="ext-value">{user.city}</span>
                  </div>
                )}
                {user.postalCode && (
                  <div>
                    <span className="ext-label">Postal Code:</span>
                    <span className="ext-value">{user.postalCode}</span>
                  </div>
                )}
                {user.country && (
                  <div>
                    <span className="ext-label">Country:</span>
                    <span className="ext-value">{user.country}</span>
                  </div>
                )}
                {user.googleId && (
                  <div>
                    <span className="ext-label">Google Account:</span>
                    <span className="ext-value text-green">✓ Connected</span>
                  </div>
                )}
              </div>

              <div className="user-actions">
                <div className="role-selector">
                  <span className="role-label">Role:</span>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="btn-delete-user"
                >
                  {isLoading ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-controls">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle-details"
          >
            {isExpanded ? '▲ Hide Details' : '▼ Show Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;