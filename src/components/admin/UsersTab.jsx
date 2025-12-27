import React, { useState, useMemo } from 'react';
import UserCard from './UserCard.jsx';

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
		<div>
			<div className="mb-6">
				<h3 className="font-semibold text-lg mb-4">Registered Users ({users.length})</h3>
				
				{/* Stats Cards */}
				<div className="grid grid-cols-3 gap-4 mb-6">
					<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
						<div className="text-2xl font-bold text-blue-600">{users.length}</div>
						<div className="text-sm text-blue-700">Total Users</div>
					</div>
					<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
						<div className="text-2xl font-bold text-purple-600">{adminCount}</div>
						<div className="text-sm text-purple-700">Admins</div>
					</div>
					<div className="bg-green-50 p-4 rounded-lg border border-green-200">
						<div className="text-2xl font-bold text-green-600">{customerCount}</div>
						<div className="text-sm text-green-700">Customers</div>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="flex-1">
						<input
							type="text"
							placeholder="Search by name, email, phone, location..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="sm:w-48">
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Users</option>
							<option value="admin">Admins Only</option>
							<option value="customer">Customers Only</option>
						</select>
					</div>
				</div>

				{searchTerm && (
					<div className="mb-4 text-sm text-gray-600">
						Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching your search
					</div>
				)}
			</div>

			{filteredUsers.length === 0 ? (
				<div className="text-center py-10 text-gray-600">
					{searchTerm || roleFilter !== 'all' 
						? 'No users found matching your filters.' 
						: 'No users registered yet.'
					}
				</div>
			) : (
				<div className="grid gap-4">
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
