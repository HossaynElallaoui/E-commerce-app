import { useState } from 'react'
import './Contact.css'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [status, setStatus] = useState(null) // null, 'submitting', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus('submitting')

        // Simulate API call
        setTimeout(() => {
            setStatus('success')
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 1500)
    }

    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1 className="contact-title">Get in Touch</h1>
                <p className="contact-subtitle">We'd love to hear from you. Send us a message!</p>
            </div>

            <div className="contact-container">
                <div className="contact-info-card">
                    <h2>Contact Information</h2>
                    <p className="info-text">
                        Have a question about our products or your order? Reach out to us and we'll get back to you as soon as possible.
                    </p>

                    <div className="info-item">
                        <span className="info-icon">📍</span>
                        <div>
                            <h3>Address</h3>
                            <p>123 Artisan Way, Creative District<br />Marrakech, Morocco</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-icon">📧</span>
                        <div>
                            <h3>Email</h3>
                            <p>hello@artisantreasures.com</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-icon">📞</span>
                        <div>
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="social-links">
                        <a href="#" className="social-link">Instagram</a>
                        <a href="#" className="social-link">Twitter</a>
                        <a href="#" className="social-link">Facebook</a>
                    </div>
                </div>

                <div className="contact-form-card">
                    <h2>Send a Message</h2>
                    {status === 'success' && (
                        <div className="success-message">
                            Thank you! Your message has been sent successfully. We'll be in touch soon.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                className="form-input"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="What is this regarding?"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-textarea"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Write your message here..."
                                rows="5"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
