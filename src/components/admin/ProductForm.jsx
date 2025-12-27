import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../../api.js';

function ProductForm({ editingProduct, onProductSaved, onCancel }) {
	const [formData, setFormData] = useState({
		name: '',
		type: 'biogas',
		price: '',
		description: '',
		capacity: '',
		warrantyPeriod: '',
		stock: '',
		image: ''
	});

	useEffect(() => {
		if (editingProduct) {
			setFormData({
				name: editingProduct.name || '',
				type: editingProduct.type || 'biogas',
				price: editingProduct.price || '',
				description: editingProduct.description || '',
				capacity: editingProduct.capacity || '',
				warrantyPeriod: editingProduct.warrantyPeriod || '',
				stock: editingProduct.stock || '',
				image: editingProduct.image || ''
			});
		}
	}, [editingProduct]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingProduct) {
				await updateProduct(editingProduct._id, formData);
			} else {
				await createProduct(formData);
			}
			onProductSaved();
		} catch (error) {
			console.error('Error saving product:', error);
			toast.error('Failed to save product');
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			type: 'biogas',
			price: '',
			description: '',
			capacity: '',
			warrantyPeriod: '',
			stock: '',
			image: ''
		});
		onCancel();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-4">
				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Product Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Type</label>
					<select
						name="type"
						value={formData.type}
						onChange={handleChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					>
						<option value="biogas">Biogas System</option>
						<option value="fertilizer">Organic Fertilizer</option>
					</select>
				</div>

				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Price (Rs.)</label>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows="3"
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Capacity</label>
						<input
							type="text"
							name="capacity"
							value={formData.capacity}
							onChange={handleChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Warranty Period</label>
						<input
							type="text"
							name="warrantyPeriod"
							value={formData.warrantyPeriod}
							onChange={handleChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Stock Quantity</label>
					<input
						type="number"
						name="stock"
						value={formData.stock}
						onChange={handleChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label className="block text-sm leading-5 font-medium text-gray-700 mb-2">Image URL</label>
					<input
						type="text"
						name="image"
						value={formData.image}
						onChange={handleChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						placeholder="https://example.com/image.jpg"
					/>
				</div>
			</div>

			<div className="flex gap-2.5 mt-6">
				<button type="submit" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50">
					{editingProduct ? 'Update Product' : 'Add Product'}
				</button>
				<button type="button" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200" onClick={resetForm}>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default ProductForm;
