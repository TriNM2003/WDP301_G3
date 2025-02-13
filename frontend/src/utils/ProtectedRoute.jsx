import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function ProtectedRoute() {
    const { accessToken } = useContext(AppContext) || null;
    return accessToken != null ? <Outlet/>:<Navigate to="login" replace/>
}

export default ProtectedRoute
