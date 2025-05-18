"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function AuthDebug() {
  const { isAuthenticated, user } = useAuth();
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage directly
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');
    
    setLocalToken(token);
    setLocalUser(userJson);
    
    // Setup interval to check for changes
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('authToken');
      const currentUserJson = localStorage.getItem('user');
      
      if (currentToken !== localToken) {
        setLocalToken(currentToken);
      }
      
      if (currentUserJson !== localUser) {
        setLocalUser(currentUserJson);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [localToken, localUser]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs overflow-auto z-50">
      <h3 className="font-bold mb-2">Auth Context Debug</h3>
      <p>isAuthenticated: {isAuthenticated ? "true" : "false"}</p>
      <p>context user: {user ? user.name : "null"}</p>
      <p>localStorage token: {localToken ? "exists" : "null"}</p>
      <p>localStorage user: {localUser ? "exists" : "null"}</p>
      {localUser && <p>localStorage user data: {localUser.substring(0, 50)}...</p>}
      <button 
        className="bg-red-500 text-white rounded px-2 py-1 mt-2"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  );
}
