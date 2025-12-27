import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateUserRole, deleteUser } from '../../api.js';

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
		<div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<div className="flex items-center gap-2.5 mb-2">
						<h4 className="m-0 text-lg font-semibold text-gray-800">
							{user.fullName || user.name || user.email}
						</h4>
						<span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
							user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
						}`}>
							{user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
						</span>
					</div>
					
					<div className="space-y-1 text-sm">
						<div className="text-gray-600">📧 {user.email}</div>
						{user.phone && <div className="text-gray-600">📱 {user.phone}</div>}
						{user.location && <div className="text-gray-600">📍 {user.location}</div>}
					</div>
					
					<div className="text-xs text-gray-500 mt-2">
						Joined: {new Date(user.createdAt).toLocaleDateString()}
					</div>

					{isExpanded && (
						<div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
							<div className="grid grid-cols-2 gap-4 text-sm">
								{user.city && (
									<div>
										<span className="font-medium text-gray-700">City:</span>
										<span className="ml-2 text-gray-600">{user.city}</span>
									</div>
								)}
								{user.postalCode && (
									<div>
										<span className="font-medium text-gray-700">Postal Code:</span>
										<span className="ml-2 text-gray-600">{user.postalCode}</span>
									</div>
								)}
								{user.country && (
									<div>
										<span className="font-medium text-gray-700">Country:</span>
										<span className="ml-2 text-gray-600">{user.country}</span>
									</div>
								)}
								{user.googleId && (
									<div>
										<span className="font-medium text-gray-700">Google Account:</span>
										<span className="ml-2 text-green-600">✓ Connected</span>
									</div>
								)}
							</div>

							<div className="flex gap-2 pt-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-700">Role:</span>
									<select 
										value={user.role} 
										onChange={(e) => handleRoleChange(e.target.value)}
										disabled={isLoading}
										className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="customer">Customer</option>
										<option value="admin">Admin</option>
									</select>
								</div>
								
								<button
									onClick={handleDeleteUser}
									disabled={isLoading}
									className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? '...' : 'Delete'}
								</button>
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col items-end gap-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-blue-500 hover:text-blue-700 text-sm font-medium"
					>
						{isExpanded ? '▲ Hide Details' : '▼ Show Details'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
