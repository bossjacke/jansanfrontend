import React, { useState } from 'react';
import './contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                {/* Header */}
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Have questions about our products or need help with your order? We're here to help!</p>
                </div>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <div className="info-card">
                            <h3>Get in Touch</h3>
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div>
                                    <div className="info-title">Address</div>
                                    <div className="info-text">123 Eco Street, Green City, GC 12345</div>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <div>
                                    <div className="info-title">Phone</div>
                                    <div className="info-text">+1 (555) 123-4567</div>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">✉️</div>
                                <div>
                                    <div className="info-title">Email</div>
                                    <div className="info-text">info@jansan-eco.com</div>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Business Hours</h3>
                            <div className="hours-item">
                                <span>Monday - Friday</span>
                                <span>9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="hours-item">
                                <span>Saturday</span>
                                <span>9:00 AM - 4:00 PM</span>
                            </div>
                            <div className="hours-item">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrapper">
                        <div className="form-card">
                            <h3>Send us a Message</h3>
                            
                            {submitted ? (
                                <div className="success-message">
                                    <div className="success-icon">✅</div>
                                    <h4>Message Sent!</h4>
                                    <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn-primary">
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="name">Your Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>
                                    
                                    <div className="form-footer">
                                        <p className="required-note">* Required fields</p>
                                        <button type="submit" className="btn-primary">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-card">
                            <h3>How long does installation take?</h3>
                            <p>Standard biogas unit installation typically takes 1-2 days for residential systems and 3-5 days for commercial installations.</p>
                        </div>
                        <div className="faq-card">
                            <h3>Do you offer warranties?</h3>
                            <p>Yes! All our biogas systems come with a 2-5 year warranty, and our fertilizers are guaranteed for quality.</p>
                        </div>
                        <div className="faq-card">
                            <h3>What areas do you serve?</h3>
                            <p>We provide installation and delivery services throughout the region. Contact us to check availability in your area.</p>
                        </div>
                        <div className="faq-card">
                            <h3>Can I get technical support?</h3>
                            <p>Absolutely! We offer 24/7 technical support for all our products and provide maintenance services.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}