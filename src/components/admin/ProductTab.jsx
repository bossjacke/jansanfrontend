import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProducts, deleteProduct } from '../../api.js';
import ProductForm from './ProductForm.jsx';
import ProductCard from './ProductCard.jsx';
import './Admin.css';

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

  if (loading) return <div className="loading-text">Loading products...</div>;

  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="product-tab">
      <div className="tab-header">
        <h2 className="tab-title">Products</h2>
        <button
          className="btn-toggle"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showAddForm ? (
        <div className="form-container">
          <ProductForm
            editingProduct={editingProduct}
            onProductSaved={handleProductSaved}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="products-grid">
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
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">No products found</h3>
          <p className="empty-text">Add your first product to get started</p>
          <button
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add Product
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductTab;