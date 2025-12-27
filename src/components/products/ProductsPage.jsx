import React, { useState, useEffect } from 'react';
import { getAllProducts, addToCart as addToCartApi } from '../../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from './ProductCard.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import ProductSummary from './ProductSummary.jsx';
import './Product.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ProductsPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const notifySuccess = (product) => toast.success(product + " added to cart");
  const notifyError = (error) => toast.error(errorMsg+" Add to cart failed!");
  const notifyInfo = () => toast.info("Please login befor add items to cart! ");
  const notifyWarning = () => toast.warning("Please wait!");


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      const products = response.data || [];
      setProducts(products);
      setError(null);
    } catch (err) {
      console.error('ProductsPage: Error fetching products:', err);
      setError('Failed to load products from backend. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user || !token) {
      notifyInfo();
      // alert('Please login to add items to cart');

      return;
    }

    try {
      await addToCartApi(product._id, 1);
      notifySuccess(product.name);
      // alert(`${product.name} added to cart`);
    } catch (err) {
      console.error('Add to cart error:', err);
      const errorMsg = err?.message || err?.response?.data?.message || 'Could not add to cart';
      notifyError(errorMsg);
      notifyWarning();
      // alert(errorMsg);
    }
  };

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.type === selectedCategory
  );

  if (loading) return <LoadingState />;

  if (error) return <ErrorState error={error} onRetry={fetchProducts} />;

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Our Products</h1>
          <p className="products-subtitle">
            High-quality biogas systems and organic fertilizers for sustainable agriculture
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={products}
        />

        {filteredProducts.length === 0 ? (
          <EmptyState
            selectedCategory={selectedCategory}
            onViewAll={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}

        {products.length > 0 && <ProductSummary products={products} />}
      </div>
    </div>
  );
}

export default ProductsPage;