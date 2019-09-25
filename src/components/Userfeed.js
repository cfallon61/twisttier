import React, {Component} from 'react';
import Spin from './spin.jsx';

const UserFeed = () => {

        //TODO: Get data from backend on which spins to show.
        var spinExample = {
            content: "Here you go!",
            username: "Tarcan",
            timestamp: "9/24/19 2:05 PM"
        };
        var spinExample2 = {
            content: "Another message!",
            username: "Tarcan",
            timestamp: "9/24/19 2:20 PM"
        };
        var spins = [];
        spins.push(spinExample);
        spins.push(spinExample2);
        console.log(spins);
        //Right now we will use three parts of the spin.
        //content, username and timestamp.

        var spinViews = []
        for(var i = 0; i < spins.length; i++)
        {
            spinViews.push(<Spin content={spins[i].content} username={spins[i].username} timestamp={spins[i].timestamp}></Spin>);
        }
        console.log(spinViews);
        return (
            <div className="spin-container">
                {spinViews}
            </div>
        );
}

export default UserFeed;