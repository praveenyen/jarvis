'use client';

import React, { useState } from 'react';
import { signInWithRedirect } from '@repo/auth-middleware/client';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await signInWithRedirect({ 
      provider: 'Google',
    });
    
    if (!result.success) {
      const err = result.error as any;
      console.error('Sign in error:', err);
      
      if (err?.name === 'UserAlreadyAuthenticatedException') {
        setError('You are already signed in.');
      } else {
        setError(err?.message || 'Failed to sign in. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSignInWithGoogle}
          disabled={isLoading}
          className="bg-primary text-white p-4 px-8 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
