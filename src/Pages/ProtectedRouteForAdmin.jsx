import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if adminLoggedIn exists in localStorage
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        
        if (adminLoggedIn === 'true') {
            setIsLoggedIn(true); // Set logged-in status
        }

        setIsLoading(false); // Set loading to false after the check
    }, []);

    // While checking, render a loading screen (optional)
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    // Redirect to AdminLogin if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/AdminLogin" replace />;
    }

    return children; // Render children if logged in
};

export default ProtectedRoute;
