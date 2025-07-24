import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });


    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    
    const registerUser = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'User registered successfully !!'
                });
            }, 1000);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const onRegister = async () => {
        const { name, email, phone, password, confirmPassword } = formData;

        if (!name.trim()) 
            return toast.warn("Name is required");
        if (!email.trim()) 
            return toast.warn("Email is required");
        if (!phone.trim()) 
            return toast.warn("Phone number is required");
        if (!password.trim()) 
            return toast.warn("Password is required");
        if (!confirmPassword.trim()) 
            return toast.warn("Confirm Password is required");
        if (password !== confirmPassword) 
            return alert('Passwords do not match');

        setLoading(true);
        try {
            const result = await registerUser();
            if (result.success) {
                toast.success('Registration successful! Please sign in');
                navigate('/login');
            } else {
                toast.error('Registration failed! Please try again');
            }
        } catch (error) {
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-3">Join Final Destination</h2>
                        <p className="text-center text-muted">Register to explore the world with us</p>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="xyz@example.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Lock size={16} />
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="btn btn-outline-secondary"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Lock size={16} />
                                </span>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="btn btn-outline-secondary"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="d-grid mb-3">
                            <button
                                onClick={onRegister}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? (
                                    <div className="d-flex align-items-center justify-content-center">
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            Already have an account?{' '}
                            <Link to="/" className="text-primary text-decoration-none">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
