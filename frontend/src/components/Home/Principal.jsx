import React from 'react'
import LatestRaces from './LatestRaces'

function Principal() {
    return (
        <div className="principal">
            <div>
                <h1>Welcome Back</h1>
                <p>Check out the opinions about the last Formula 1® races</p>
            </div>
            <LatestRaces />
        </div>
    )
}

export default Principal