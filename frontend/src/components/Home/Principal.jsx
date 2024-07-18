import React from 'react'
import LatestRaces from './LatestRaces'

function Principal() {
    return (
        <div className="principal">
            <div>
                <h1>Welcome Back</h1>
                <p>Check out everyone's opinion about the last races</p>
            </div>
            <LatestRaces />
        </div>
    )
}

export default Principal