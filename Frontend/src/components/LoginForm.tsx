import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Film, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/');
    } catch (err: unknown) {
      // handle different error shapes safely without using 'any'
      type ErrorWithResponse = { response?: { data?: { error?: string } } };
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const e = err as ErrorWithResponse;
        setError(e.response?.data?.error || 'Failed to login');
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to login');
      } else {
        setError('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-200 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <Film className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-white/80 text-lg">
            Sign in to your media collection
          </p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse-soft" />
            <span className="text-white/60 text-sm">Your favorite movies and shows await</span>
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse-soft" />
          </div>
        </div>
        
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            
            <div className="text-center">
              <p className="text-white/70">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:text-white/90 transition-colors underline"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-white/50 text-sm">
            Join thousands of movie enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};