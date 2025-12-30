import React, { useState, useMemo } from 'react';
import UserCard from './UserCard.jsx';
import './Admin.css';

const UsersTab = ({ users, onUserUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const adminCount = users.filter(user => user.role === 'admin').length;
  const customerCount = users.filter(user => user.role === 'customer').length;

  return (
    <div className="users-tab">
      <div className="users-header">
        <h3 className="users-title">Registered Users ({users.length})</h3>
        
        {/* Stats Cards */}
        <div className="users-stats">
          <div className="stat-card blue">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-value">{adminCount}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card green">
            <div className="stat-value">{customerCount}</div>
            <div className="stat-label">Customers</div>
          </div>
        </div>

        {/* Filters */}
        <div className="users-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, phone, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="customer">Customers Only</option>
            </select>
          </div>
        </div>

        {searchTerm && (
          <div className="search-results">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching your search
          </div>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-users">
          {searchTerm || roleFilter !== 'all' 
            ? 'No users found matching your filters.' 
            : 'No users registered yet.'
          }
        </div>
      ) : (
        <div className="users-list">
          {filteredUsers.map(user => (
            <UserCard 
              key={user._id} 
              user={user} 
              onUserUpdate={onUserUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersTab;