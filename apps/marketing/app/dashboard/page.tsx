'use client';

import React, { use, useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Link } from '@vercel/microfrontends/next/client';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const userDetails = await getCurrentUser();
        console.log('User details:', userDetails);
        setUser(userDetails);
      } catch (error) {
        console.log('Error fetching user', error);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    signOut({
        global: true,
        oauth: {
            redirectUrl: window.location.origin + '/login',
        }
    });
  };

  return (
    <div>
      Dashboard
      {JSON.stringify(user, null, 2)}
      <br />
      <br />
      <br />
      <Link href="/login" className="bg-blue-400 text-white px-4 py-1 rounded">
        Goto Login
      </Link>
      <button
        className="bg-red-400 text-white px-4 py-1 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
