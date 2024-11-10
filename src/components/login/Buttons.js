import React from 'react';

export default function Buttons(props) {
    return(
        <div className={"row"}>
            <div clasName="col-md-12 text-center" style={{marginTop: "30px"}}>
            <button onClick={props.login}>Login</button>
            <button onClick={props.logout}>Logout</button>
        </div>
        </div>
    )
}