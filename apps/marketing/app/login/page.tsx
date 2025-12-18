'use client';

import React from 'react';
import {
  AuthError,
  AuthSession,
  decodeJWT,
  fetchAuthSession,
  JWT,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';

const page = () => {
  const handleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      if (error.name === 'UserAlreadyAuthenticatedException') {
        alert('User is already signed in.');
      }
    }
  };
  return (
    <div>
      <div className="">
        <div className="h-screen w-screen flex items-center justify-center ">
          <button
            onClick={handleSignIn}
            className="bg-primary text-white p-1 px-4 rounded-md md:p-20 md:px-80"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
