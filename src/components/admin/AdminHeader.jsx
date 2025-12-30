import React from 'react';
import './Admin.css';

const AdminHeader = ({ activeTab, setActiveTab, productsLength, usersLength, ordersLength }) => {
  const tabs = [
    { id: 'products', label: 'Products', icon: '📦', count: productsLength || 0 },
    { id: 'users', label: 'Users', icon: '👥', count: usersLength || 0 },
    { id: 'orders', label: 'Orders', icon: '📋', count: ordersLength || 0 }
  ];

  return (
    <div className="admin-header">
      <div className="admin-tabs">
        <nav className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-content">
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="admin-stats">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`stat-card ${activeTab === tab.id ? 'active' : ''}`}
          >
            <div className="stat-info">
              <p className="stat-label">{tab.label}</p>
              <p className="stat-value">{tab.count}</p>
            </div>
            <div className="stat-icon">{tab.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHeader;