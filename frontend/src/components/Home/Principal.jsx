import React from 'react'
import LatestRaces from './LatestRaces'

function Principal() {
    let username = '';
    if(sessionStorage.getItem('username')){
        username = sessionStorage.getItem('username');
    }

    return (
        <div className="principal">
            <div>
                <h1>Bienvenido, { username }</h1>
                <p>Mira las reseñas de las últimas carreras de la Formula 1®</p>
            </div>
            <LatestRaces />
        </div>
    )
}

export default Principal