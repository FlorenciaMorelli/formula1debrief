// Admin.jsx

import React, { useState } from 'react';
import Races from '../components/Races/Races';
import Reviews from '../components/Reviews/Reviews';
import Likes from '../components/Likes/Likes';
import Users from '../components/Users/Users';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/reducers/authSlice';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('races');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Bienvenido al administrador</h1>
            <button onClick={handleLogout} className='btn-logout'>Cerrar sesión</button>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'races' ? 'active' : ''}`} onClick={() => handleTabChange('races')}>
                        Carreras
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabChange('reviews')}>
                        Reseñas
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => handleTabChange('likes')}>
                        Likes
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>
                        Usuarios
                    </button>
                </li>
            </ul>
            <div className="tab-content">
                <div className={`tab-pane ${activeTab === 'races' ? 'active' : ''}`}>
                    <Races />
                </div>
                <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
                    <Reviews />
                </div>
                <div className={`tab-pane ${activeTab === 'likes' ? 'active' : ''}`}>
                    <Likes />
                </div>
                <div className={`tab-pane ${activeTab === 'users' ? 'active' : ''}`}>
                    <Users />
                </div>
            </div>
        </div>
    );
};

export default Admin;
