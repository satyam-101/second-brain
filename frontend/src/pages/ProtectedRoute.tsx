import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
type ProtectedProps ={
    children:React.ReactNode;
}

const ProtectedRoute = ({children}:ProtectedProps) => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    if((location.pathname=="/" || location.pathname=="/login") && token){
        return <Navigate to={"/Dashboard"} replace/>
    }
    if((location.pathname=="Dashboard" || location.pathname=="chat"||location.pathname=="search") &&!token){
        return <Navigate to={"/login"} replace/>
    }
  return children;
}

export default ProtectedRoute