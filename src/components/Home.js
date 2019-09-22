import React from 'react';
import Button from 'react-bootstrap/Button';
import Spin from './spin.jsx';

const Home = () => {
    return (
        <div>
            <Spin className="spintest" username="tgul" content="Say hi to spins." timestamp="12:56 pm, 9/18/2019" />
        </div>
    )
}

export default Home
