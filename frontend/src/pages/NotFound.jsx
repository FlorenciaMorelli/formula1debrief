import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev === 1) {
                    navigate(-1);
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className='notFound'>
            <h1>Nada por aquí</h1>
            <br />
            <p>Redirigiendo a la página anterior en {seconds} segundos...</p>
        </div>
    )
}

export default NotFound