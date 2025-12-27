import React from 'react';

const AdminHeader = ({ activeTab, setActiveTab, productsLength, usersLength, ordersLength }) => {
	const tabs = [
		{
			id: 'products',
			label: 'Products',
			icon: '📦',
			count: productsLength || 0,
			color: 'blue'
		},
		{
			id: 'users',
			label: 'Users',
			icon: '👥',
			count: usersLength || 0,
			color: 'green'
		},
		{
			id: 'orders',
			label: 'Orders',
			icon: '📋',
			count: ordersLength || 0,
			color: 'purple'
		}
	];

	const getTabClasses = (tabId, color) => {
		const isActive = activeTab === tabId;
		const baseClasses = 'relative px-6 py-3 font-medium transition-all duration-200 border-b-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2';
		
		if (isActive) {
			const colorClasses = {
				blue: 'border-blue-500 text-blue-600 focus:ring-blue-200',
				green: 'border-green-500 text-green-600 focus:ring-green-200',
				purple: 'border-purple-500 text-purple-600 focus:ring-purple-200'
			};
			return `${baseClasses} ${colorClasses[color]}`;
		}
		
		return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700`;
	};

	return (
		<div className="mb-8">
			<div className="border-b border-gray-200">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							className={getTabClasses(tab.id, tab.color)}
							onClick={() => setActiveTab(tab.id)}
						>
							<span className="flex items-center space-x-2">
								<span className="text-lg">{tab.icon}</span>
								<span>{tab.label}</span>
								{tab.count > 0 && (
									<span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										activeTab === tab.id 
											? `bg-${tab.color}-100 text-${tab.color}-800`
											: 'bg-gray-100 text-gray-600'
									} ml-2`}>
										{tab.count}
									</span>
								)}
							</span>
						</button>
					))}
				</nav>
			</div>
			
			{/* Summary Stats */}
			<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`bg-white rounded-lg shadow-sm border p-4 ${
							activeTab === tab.id 
								? `border-${tab.color}-200 ring-2 ring-${tab.color}-100` 
								: 'border-gray-200'
						}`}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">{tab.label}</p>
								<p className="text-2xl font-bold text-gray-900">{tab.count}</p>
							</div>
							<div className="text-3xl opacity-50">{tab.icon}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminHeader;
