import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProducts, deleteProduct } from '../../api.js';
import ProductForm from './ProductForm.jsx';
import ProductCard from './ProductCard.jsx';

function ProductTab({ onProductsUpdate }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await getAllProducts();
			setProducts(response.data || []);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch products');
		} finally {
			setLoading(false);
		}
	};

	const handleProductSaved = () => {
		setShowAddForm(false);
		setEditingProduct(null);
		fetchProducts();
		// Notify parent component to refresh its count
		if (onProductsUpdate) {
			onProductsUpdate();
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setShowAddForm(true);
	};

	const handleDelete = async (productId) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			try {
				await deleteProduct(productId);
				fetchProducts();
				// Notify parent component to refresh its count
				if (onProductsUpdate) {
					onProductsUpdate();
				}
			} catch (err) {
				toast.error('Failed to delete product');
			}
		}
	};

	const handleCancel = () => {
		setShowAddForm(false);
		setEditingProduct(null);
	};

	if (loading) return <div className="text-center py-10">Loading products...</div>;

	if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-800">Products</h2>
				<button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50" onClick={() => setShowAddForm(!showAddForm)}>
					{showAddForm ? 'Cancel' : '+ Add New Product'}
				</button>
			</div>

			{showAddForm ? (
				<div className="bg-white rounded-xl p-6 mb-6 shadow-md">
					<ProductForm
						editingProduct={editingProduct}
						onProductSaved={handleProductSaved}
						onCancel={handleCancel}
					/>
				</div>
			) : (
				<div className="grid gap-4">
					{products.map(product => (
						<ProductCard
							key={product._id}
							product={product}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}

			{products.length === 0 && !showAddForm && (
				<div className="text-center py-16">
					<div className="text-5xl mb-4">📦</div>
					<h3 className="text-gray-600 mb-3">No products found</h3>
					<p className="text-gray-400 mb-5">Add your first product to get started</p>
					<button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50" onClick={() => setShowAddForm(true)}>
						+ Add Product
					</button>
				</div>
			)}
		</div>
	);
}

export default ProductTab;
