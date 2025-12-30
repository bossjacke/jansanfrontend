import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../../api.js';
import './Admin.css';

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
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="biogas">Biogas System</option>
            <option value="fertilizer">Organic Fertilizer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price (Rs.)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Warranty Period</label>
          <input
            type="text"
            name="warrantyPeriod"
            value={formData.warrantyPeriod}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" className="btn-secondary" onClick={resetForm}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductForm;