import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../api.js';
import SmokeDemo from '../smoke/SmokeDemo.jsx';
import './home.css';

function Home() {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				console.log('🏠 Home: Starting to fetch featured products...');
				const response = await getAllProducts();
				console.log('🏠 Home: API response:', response);
				console.log('🏠 Home: Response data:', response.data);

				const products = response.data || [];
				setFeaturedProducts(products.slice(0, 3));
			} catch (error) {
				console.error('🏠 Home: Error fetching featured products:', error);
				console.error('🏠 Home: Error details:', error.response?.data || error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, []);

	return (
		<div className="home-container">
			<SmokeDemo />

			{/* Hero Section */}
			<section className="hero-section">
				<div>
					<h1>Welcome to Adams Fire Eco Solutions</h1>
					<p>Your trusted partner for sustainable biogas systems and premium organic fertilizers</p>
					<div className="buttons-container">
						<Link to="/products" className="btn btn-primary">
							Shop Now
						</Link>
						<Link to="/about" className="btn btn-secondary">
							Learn More
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="section">
				<div>
					<div>
						<h2 className="section-title">Why Choose Adams Fire ?</h2>
						<p className="section-subtitle">Discover what makes us the preferred choice for sustainable solutions</p>
						<p className="section-subtitle"><strong>Green path--global growth</strong></p>
					</div>
					<div className="features-grid">
						<div className="feature-card">
							<div>
								<h3>100% Organic</h3>
								<p>All our fertilizers are certified organic and safe for sustainable farming practices</p>
							</div>
						</div>
						<div className="feature-card">
							<div>
								<h3>Efficient Biogas</h3>
								<p>High-quality biogas systems with excellent warranty and comprehensive support</p>
							</div>
						</div>
						<div className="feature-card">
							<div>
								<h3>Fast Delivery</h3>
								<p>Quick and reliable delivery service across all regions with real-time tracking</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="section">
				<div>
					<div>
						<h2 className="section-title">Featured Products</h2>
						<p className="section-subtitle">Check out our most popular biogas systems and premium fertilizers</p>
					</div>

					{loading ? (
						<div className="loading-container">
							<p>Loading featured products...</p>
						</div>
					) : (
						<div className="products-grid">
							{featuredProducts.map((product) => (
								<div key={product._id} className="product-card">
									<div>
										<div>
											<h3>{product.name}</h3>
											<span className={`product-type ${product.type === 'biogas' ? 'biogas' : 'fertilizer'}`}>
												{product.type === 'biogas' ? 'Biogas' : 'Fertilizer'}
											</span>
										</div>

										{product.description && (
											<p>{product.description}</p>
										)}

										<div>
											{product.capacity && (
												<div>
													Capacity: {product.capacity}
												</div>
											)}
											{product.warrantyPeriod && (
												<div>
													Warranty: {product.warrantyPeriod}
												</div>
											)}
										</div>

										<div>
											<div className="product-price">Rs.{product.price.toLocaleString()}</div>
											<Link to="/products" className="btn btn-primary">
												View Details
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{!loading && featuredProducts.length === 0 && (
						<div className="empty-state">
							<p>No featured products available at the moment.</p>
							<Link to="/products" className="btn btn-primary">View All Products</Link>
						</div>
					)}

					{featuredProducts.length > 0 && (
						<div className="buttons-container">
							<Link to="/products" className="btn btn-primary">
								View All Products
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="cta-section">
				<div>
					<div>
						<h2>Ready to Go Green ?</h2>
						<p>Join thousands of satisfied customers who have switched to sustainable solutions</p>
						<div className="buttons-container">
							<Link to="/products" className="btn btn-primary">
								Browse Products
							</Link>
							<Link to="/register" className="btn btn-secondary">
								Create Account
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Home;
