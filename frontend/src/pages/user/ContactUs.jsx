import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Globe,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@toursandtravels.com',
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Travel Street, Adventure City, AC 12345',
      description: 'Visit our office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 9AM - 6PM',
      description: 'Saturday: 10AM - 4PM'
    }
  ];

  const departments = [
    {
      icon: Users,
      title: 'Customer Support',
      email: 'support@toursandtravels.com',
      description: 'General inquiries and booking assistance'
    },
    {
      icon: Globe,
      title: 'Tour Planning',
      email: 'planning@toursandtravels.com',
      description: 'Custom tour packages and itineraries'
    },
    {
      icon: MessageCircle,
      title: 'Feedback',
      email: 'feedback@toursandtravels.com',
      description: 'Share your experience and suggestions'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about our tours or need assistance? We're here to help you plan your perfect adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a subject</option>
                <option value="booking">Booking Inquiry</option>
                <option value="support">Customer Support</option>
                <option value="custom">Custom Tour Request</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{info.title}</h3>
                      <p className="text-gray-700">{info.details}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Departments</h2>
            <div className="space-y-4">
              {departments.map((dept, index) => {
                const Icon = dept.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">{dept.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Link */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Frequently Asked Questions</h3>
            <p className="text-emerald-100 mb-4">
              Find quick answers to common questions about our tours, booking process, and policies.
            </p>
            <button 
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/about-us')}
            >
              View FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <iframe
            title="Office Location"
            src="https://www.google.com/maps?q=123+Travel+Street,+Adventure+City,+AC+12345&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '0.5rem', minHeight: '16rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;