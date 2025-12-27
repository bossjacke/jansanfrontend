import React from 'react';

const AdminLayout = ({ children }) => (
	<div className="min-h-[calc(100vh-64px)] p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
		<div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5">
			<h1 className="gradient-text">Admin Panel</h1>
			{children}
		</div>
	</div>
);

export default AdminLayout;
