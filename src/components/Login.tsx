import React, { useState } from 'react';
import { supabase, ADMIN_ACCESS_CODE } from '../config/supabase';
import { useAppStore } from '../store/useAppStore';
import { LogIn, Shield, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const { setUser } = useAppStore();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_ACCESS_CODE) {
      setUser({
        email: 'admin@system',
        name: 'Administrator',
        isAdmin: true,
      });
      setError(null);
    } else {
      setError('Invalid admin access code');
      setAdminCode('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Title Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center border border-gray-100">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Expirations Manager
          </h1>
          <p className="text-gray-600 text-sm">
            Manage membership expirations and renewals
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Mail size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Admin Access Toggle */}
          {!showAdminInput ? (
            <button
              onClick={() => setShowAdminInput(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Shield size={18} />
              <span className="font-medium text-sm">Admin Access</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Admin Code
                </label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="****"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowAdminInput(false);
                    setAdminCode('');
                    setError(null);
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Secure authentication powered by Supabase</p>
        </div>
      </div>
    </div>
  );
};
