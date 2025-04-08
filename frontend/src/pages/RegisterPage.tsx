import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/login?registered=true');
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="w-[45%] bg-[#232342] flex flex-col px-12 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center text-gray-400">
            <span className="material-icons text-sm">language</span>
            <span className="ml-2 text-sm">English</span>
          </div>
          <button className="bg-[#E24C68] text-white px-5 py-1.5 rounded text-sm">
            ADMIN PORTAL
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center mb-16">
          <div className="bg-[#3699FF] rounded-lg p-3 mr-4">
            <span className="text-white text-2xl font-bold">IQ</span>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">InventIQ</h1>
            <p className="text-gray-400 text-sm">Next-Gen Inventory Management</p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-white text-xl font-bold mb-6">Smart Features</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="bg-[#2B2B40] p-2 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
                <span className="material-icons text-[#3699FF]">analytics</span>
              </div>
              <span className="text-gray-400 text-sm">AI-powered demand forecasting</span>
            </li>
            <li className="flex items-center">
              <div className="bg-[#2B2B40] p-2 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
                <span className="material-icons text-[#3699FF]">dashboard</span>
              </div>
              <span className="text-gray-400 text-sm">Real-time analytics dashboard</span>
            </li>
            <li className="flex items-center">
              <div className="bg-[#2B2B40] p-2 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
                <span className="material-icons text-[#3699FF]">notifications</span>
              </div>
              <span className="text-gray-400 text-sm">Smart notifications system</span>
            </li>
            <li className="flex items-center">
              <div className="bg-[#2B2B40] p-2 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
                <span className="material-icons text-[#3699FF]">insights</span>
              </div>
              <span className="text-gray-400 text-sm">Predictive inventory insights</span>
            </li>
          </ul>
        </div>

        {/* Quick Access */}
        <div className="mt-auto">
          <h2 className="text-white text-xl font-bold mb-6">Quick Access</h2>
          <div className="flex gap-4">
            <button className="bg-[#2B2B40] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3a3a52] transition-colors">
              View Demo
            </button>
            <button className="bg-[#2B2B40] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3a3a52] transition-colors">
              Explore Features
            </button>
          </div>
        </div>

        {/* Help Button */}
        <div className="absolute bottom-8 right-8">
          <button className="w-10 h-10 bg-[#2B2B40] rounded-full flex items-center justify-center text-white hover:bg-[#3a3a52] transition-colors">
            <span className="material-icons">help</span>
          </button>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-[55%] bg-white flex flex-col justify-center px-20">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Create New Account</h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Username</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-2.5 text-gray-400">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Email</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-2.5 text-gray-400">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Password</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-2.5 text-gray-400">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Confirm Password</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-2.5 text-gray-400">lock</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3699FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">Already have an account?</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#3699FF] hover:text-blue-700 transition-colors text-sm font-medium mt-1"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 