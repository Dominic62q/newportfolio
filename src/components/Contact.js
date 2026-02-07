import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // EmailJS configuration from environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'dominicquainoo62@gmail.com'
        },
        publicKey
      );

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! I\'ll get back to you within 24 hours.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try emailing me directly at dominicquainoo62@gmail.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '✉',
      title: 'Email Address',
      value: 'dominicquainoo62@gmail.com',
      link: 'mailto:dominicquainoo62@gmail.com',
      description: 'Send me an email anytime'
    },
    {
      icon: '☎',
      title: 'Phone Number',
      value: '+233 55 600 7486',
      link: 'tel:+233556007486',
      description: 'Available Mon-Fri, 9AM-6PM GMT'
    },
    {
      icon: '◉',
      title: 'Location',
      value: 'Accra, Ghana',
      link: null,
      description: 'West Africa (GMT+0)'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Dominic62q', icon: 'github', isImage: true },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dominic-amuah-bb116428b/', icon: 'in', isImage: false }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">
            I'm currently available for freelance projects and full-time opportunities.
            Let's discuss how I can contribute to your team or project.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info Cards */}
          <div className="contact-info-section">
            <div className="availability-badge">
              <span className="status-dot"></span>
              <span>Available for opportunities</span>
            </div>

            <div className="contact-info-cards">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="contact-icon">{info.icon}</div>
                  <div className="contact-details">
                    <h3 className="contact-label">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="contact-value">
                        {info.value}
                      </a>
                    ) : (
                      <p className="contact-value">{info.value}</p>
                    )}
                    <p className="contact-description">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="social-links-section">
              <h3 className="social-title">Connect With Me</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={social.name}
                  >
                    <span className="social-icon">
                      {social.isImage ? (
                        <img src="/github-icon.svg" alt="GitHub" className="social-icon-img" />
                      ) : (
                        social.icon
                      )}
                    </span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-header">
              <h3 className="form-title">Send a Message</h3>
              <p className="form-description">Fill out the form below and I'll get back to you within 24 hours.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
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
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please provide details about your project, timeline, budget, and any specific requirements..."
                rows="6"
              ></textarea>
            </div>

            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {!isSubmitting && <span className="btn-arrow">→</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
