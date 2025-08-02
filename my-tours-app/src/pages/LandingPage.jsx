import { ArrowRight, Calendar, MapPin, Shield, Star, Users } from 'lucide-react';
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const LandingPage = () => {
      const features = [
        {
          icon: <MapPin className="w-8 h-8 text-primary" />,
          title: 'Amazing Destinations',
          description: 'Explore breathtaking locations around the world with our carefully curated tour packages.'
        },
        {
          icon: <Users className="w-8 h-8 text-success" />,
          title: 'Expert Guides',
          description: 'Travel with professional guides who know the local culture and hidden gems.'
        },
        {
          icon: <Shield className="w-8 h-8 text-warning" />,
          title: 'Safe & Secure',
          description: 'Your safety is our priority. All tours are fully insured and safety-verified.'
        },
        {
          icon: <Calendar className="w-8 h-8 text-info" />,
          title: 'Flexible Booking',
          description: 'Easy booking process with flexible cancellation and rescheduling options.'
        }
      ];

      const popularTours = [
        {
          id: 1,
          title: 'Tropical Paradise Adventure',
          image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400',
          destination: 'Maldives',
          rating: 4.8,
          price: 1299,
          duration: 7
        },
        {
          id: 2,
          title: 'Mountain Expedition',
          image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=400',
          destination: 'Swiss Alps',
          rating: 4.9,
          price: 899,
          duration: 5
        },
        {
          id: 3,
          title: 'Cultural Heritage Tour',
          image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=400',
          destination: 'India',
          rating: 4.7,
          price: 756,
          duration: 6
        }
      ];

      return (
        <div className="min-vh-100 bg-light">
          {/* Header */}
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
              <div className="d-flex align-items-center">
                <img src="logo.png" alt="image" style={{
                  height: '40px',
                  width: 'auto',
                  marginRight: '10px',
                  marginLeft: '-100px'
                }}/>
                <span className="navbar-brand fw-bold">Final Destination</span>
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <div className="ms-auto">
                  <Link className="btn btn-link text-dark text-decoration-none" to="/login">
                    Sign In
                  </Link>
                  <Link className="btn btn-primary" to="/register">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <section className="bg-primary text-white position-relative ">
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            <div className="container position-relative py-5">
              <div className="text-center">
                <h1 className="display-3 fw-bold mb-4">
                  Discover Amazing
                  <span className="d-block text-warning">Adventures</span>
                </h1>
                <p className="lead mb-4 mx-auto" style={{ maxWidth: '800px' }}>
                  Create unforgettable memories with our expertly crafted tour packages to the world's most beautiful destinations.
                </p>
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                  <Link className="btn btn-warning text-dark fw-semibold btn-lg" to="/register">
                    Start Your Journey
                    <ArrowRight className="ms-2" size={20} />
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/login">
                    Explore Tours
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-5 bg-light">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Why Choose Us</h2>
                <p className="lead text-muted" style={{ maxWidth: '600px', margin: 'auto' }}>
                  We provide exceptional travel experiences with attention to every detail.
                </p>
              </div>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {features.map((feature, index) => (
                  <div key={index} className="col">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <div className="mb-3">{feature.icon}</div>
                        <h3 className="h5 fw-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Tours Section */}
          <section className="py-5">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Popular Tours</h2>
                <p className="lead text-muted" style={{ maxWidth: '600px', margin: 'auto' }}>
                  Discover our most loved destinations and experiences.
                </p>
              </div>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {popularTours.map((tour) => (
                  <div key={tour.id} className="col">
                    <div className="card h-100 border-0 shadow-sm">
                      <img src={tour.image} alt={tour.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary">{tour.destination}</span>
                          <div className="d-flex align-items-center">
                            <Star className="text-warning" size={16} fill="currentColor" />
                            <span className="ms-1 text-muted">{tour.rating}</span>
                          </div>
                        </div>
                        <h3 className="h5 fw-semibold mb-3">{tour.title}</h3>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">{tour.duration} days</span>
                          <span className="fs-5 fw-bold text-primary">${tour.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <Link className="btn btn-primary btn-lg" to="/register">
                  View All Tours
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-white py-5">
            <div className="container text-center">
              <h2 className="display-5 fw-bold mb-4">Ready for Your Next Adventure?</h2>
              <p className="lead mb-4 text-light" style={{ maxWidth: '600px', margin: 'auto' }}>
                Join thousands of happy travelers who trust us with their dream vacations.
              </p>
              <Link className="btn btn-warning text-dark fw-semibold btn-lg" to="/register">
                Book Your Trip Now
                <ArrowRight className="ms-2" size={20} />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-dark text-white py-5">
            <div className="container">
              <div className="row row-cols-1 row-cols-md-4 g-4">
                <div className="col">
                  <div className="d-flex align-items-center mb-3">
                    <MapPin className="w-6 h-6 text-primary me-2" />
                    <span className="h5 fw-bold">Tours & Travels</span>
                  </div>
                  <p className="text-muted">
                    Creating unforgettable travel experiences since 2020.
                  </p>
                </div>
                <div className="col">
                  <h3 className="h6 fw-semibold mb-3">Quick Links</h3>
                  <ul className="list-unstyled">
                    <li><Link className="text-muted text-decoration-none" to="/login">Sign In</Link></li>
                    <li><Link className="text-muted text-decoration-none" to="/register">Register</Link></li>
                    <li><a className="text-muted text-decoration-none" href="#">Tours</a></li>
                    <li><a className="text-muted text-decoration-none" href="#">About</a></li>
                  </ul>
                </div>
                <div className="col">
                  <h3 className="h6 fw-semibold mb-3">Support</h3>
                  <ul className="list-unstyled">
                    <li><a className="text-muted text-decoration-none" href="#">Help Center</a></li>
                    <li><a className="text-muted text-decoration-none" href="#">Contact Us</a></li>
                    <li><a className="text-muted text-decoration-none" href="#">Privacy Policy</a></li>
                    <li><a className="text-muted text-decoration-none" href="#">Terms of Service</a></li>
                  </ul>
                </div>
                <div className="col">
                  <h3 className="h6 fw-semibold mb-3">Contact Info</h3>
                  <div className="text-muted">
                    <p>Email: info@toursandtravels.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Travel St, Adventure City</p>
                  </div>
                </div>
              </div>
              <div className="border-top border-dark mt-4 pt-4 text-center text-muted">
                <p>© 2024 Tours & Travels. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      );
    };
export default LandingPage;