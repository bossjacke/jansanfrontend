import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>About Adams Fire Eco Solutions</h1>
                    <p>
                        Your trusted partner for sustainable agricultural solutions and renewable energy systems
                    </p>
                </section>

                {/* Mission Section */}
                <section className="mission-section">
                    <div className="mission-content">
                        <div className="mission-text">
                            <h2>Our Mission</h2>
                            <p>
                                At Adams Fire Eco Solutions, we are committed to promoting sustainable agriculture and renewable energy solutions that benefit both the environment and our customers' bottom line. We believe in creating a greener future through innovative biogas systems and organic fertilizers.
                            </p>
                            <p>
                                Our mission is to make sustainable farming and energy solutions accessible to everyone, from small households to large agricultural operations, while maintaining the highest standards of quality and environmental responsibility.
                            </p>
                        </div>
                        <div className="mission-highlight">
                            <div className="emoji">🌱</div>
                            <h3>Sustainability First</h3>
                            <p>Every product we offer is designed with environmental impact in mind</p>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="values-section">
                    <div className="value-card">
                        <div className="emoji">🔥</div>
                        <h3>Quality Products</h3>
                        <p>
                            Premium biogas systems with excellent warranty and reliable performance
                        </p>
                    </div>
                    <div className="value-card">
                        <div className="emoji">🌿</div>
                        <h3>Organic Solutions</h3>
                        <p>
                            100% organic fertilizers certified for sustainable farming practices
                        </p>
                    </div>
                    <div className="value-card">
                        <div className="emoji">🤝</div>
                        <h3>Expert Support</h3>
                        <p>
                            Professional installation, maintenance, and consultation services
                        </p>
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <h2>Our Product Range</h2>
                    <div className="products-grid">
                        <div className="product-card">
                            <div className="product-header">
                                <div className="emoji">🔥</div>
                                <h3>Biogas Systems</h3>
                            </div>
                            <ul>
                                <li>
                                    <span>✓</span>
                                    <span>Household biogas units (1-5 cubic meters)</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>Commercial biogas plants (10-100 cubic meters)</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>Complete installation and piping</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>2-5 year warranty on all systems</span>
                                </li>
                            </ul>
                        </div>
                        <div className="product-card">
                            <div className="product-header">
                                <div className="emoji">🌱</div>
                                <h3>Organic Fertilizers</h3>
                            </div>
                            <ul>
                                <li>
                                    <span>✓</span>
                                    <span>NPK enriched organic fertilizers</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>Bio-fertilizers from biogas byproducts</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>Soil conditioning products</span>
                                </li>
                                <li>
                                    <span>✓</span>
                                    <span>Crop-specific nutrient solutions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <h2>Our Impact</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">1000+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Biogas Installations</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Tons of Fertilizers Sold</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Customer Satisfaction</div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <h2>Ready to Go Green?</h2>
                    <p>
                        Join thousands of satisfied customers who have switched to sustainable solutions
                    </p>
                    <div className="cta-buttons">
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            Contact Us
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
