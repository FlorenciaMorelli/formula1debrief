import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authSlice';
import Principal from '../components/Home/Principal';
import { useNavigate } from 'react-router-dom';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <>
            <button onClick={handleLogout} className='btn-logout'>Cerrar sesión</button>
            <Principal />
        </>
    );
}

export default Home;
