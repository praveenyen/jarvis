'use client';

import React, { use, useEffect, useState } from 'react';
import { Link } from '@vercel/microfrontends/next/client';

const Dashboard = () => {
  const [user, setUser] = useState(null);


  return (
    <div>
      Dashboard
      <br />
      <br />
      <br />
      <Link href="/login" className="bg-blue-400 text-white px-4 py-1 rounded">
        Goto Login
      </Link>
      <button
        className="bg-red-400 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
