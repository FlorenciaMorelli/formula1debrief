// Admin.jsx

import React, { useState } from 'react';
import Races from '../components/Races/Races';
import Reviews from '../components/Reviews/Reviews';
import Comments from '../components/Comments/Comments';
import Users from '../components/Users/Users';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('races');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Bienvenido al administrador</h1>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'races' ? 'active' : ''}`} onClick={() => handleTabChange('races')}>
                        Races
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabChange('reviews')}>
                        Reviews
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => handleTabChange('comments')}>
                        Comments
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>
                        Users
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
                <div className={`tab-pane ${activeTab === 'comments' ? 'active' : ''}`}>
                    <Comments />
                </div>
                <div className={`tab-pane ${activeTab === 'users' ? 'active' : ''}`}>
                    <Users />
                </div>
            </div>
        </div>
    );
};

export default Admin;
