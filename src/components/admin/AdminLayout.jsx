import React from 'react';
import './Admin.css';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      {children}
    </div>
  </div>
);

export default AdminLayout;