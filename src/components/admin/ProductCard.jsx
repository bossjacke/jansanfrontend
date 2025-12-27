import React from 'react';

function ProductCard({ product, onEdit, onDelete }) {
	return (
		<div className="bg-white rounded-xl p-6 shadow-md">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
					<span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
						product.type === 'biogas' ? 'bg-orange-500' : 'bg-green-500'
					}`}>
						{product.type === 'biogas' ? '🔥 Biogas' : '🌱 Fertilizer'}
					</span>
				</div>
				<div className="text-xl font-bold text-gray-800">
					Rs.{product.price.toLocaleString()}
				</div>
			</div>

			{product.description && (
				<p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
			)}

			<div className="grid grid-cols-2 gap-4 mb-4 text-sm">
				{product.capacity && (
					<div>
						<span className="text-gray-500">Capacity:</span>
						<span className="font-medium">{product.capacity}</span>
					</div>
				)}
				{product.warrantyPeriod && (
					<div>
						<span className="text-gray-500">Warranty:</span>
						<span className="font-medium">{product.warrantyPeriod}</span>
					</div>
				)}
				<div>
					<span className="text-gray-500">Stock:</span>
					<span className="font-medium">{product.stock}</span>
				</div>
				<div>
					<span className="text-gray-500">Type:</span>
					<span className="font-medium capitalize">{product.type}</span>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-yellow-500 text-black hover:bg-yellow-600"
					onClick={() => onEdit(product)}
				>
					Edit
				</button>
				<button
					className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-red-600 text-white hover:bg-red-700"
					onClick={() => onDelete(product._id)}
				>
					Delete
				</button>
			</div>
		</div>
	);
}

export default ProductCard;
