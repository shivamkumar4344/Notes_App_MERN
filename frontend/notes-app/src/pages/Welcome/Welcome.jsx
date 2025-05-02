import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for authentication and redirect accordingly
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };
    
    // Add a small delay for the welcome screen to be visible
    const timer = setTimeout(() => {
      checkAuth();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">Notes App</h1>
        <p className="text-xl text-gray-700 mb-8">Your personal space for thoughts and ideas</p>
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
} 