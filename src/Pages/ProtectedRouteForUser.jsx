import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if userLoggedIn exists in localStorage
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        
        if (userLoggedIn === 'true') {
            setIsLoggedIn(true); // Set logged-in status
        }

        setIsLoading(false); // Set loading to false after the check
    }, []);

    // While checking, render a loading screen (optional)
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    // Redirect to login page if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children; // Render children if logged in
};

export default ProtectedRoute;
