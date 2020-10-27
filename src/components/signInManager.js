import React from 'react';

const SignInManager = ({ loggedIn }) => {

    return (
        <div className="small-form-container">
            <input type="text" id="email" placeholder="Email"></input>
            <input type="password" id="password" placeholder="Password"></input>
            <button>Sign In</button>
        </div>
    )
}

export default SignInManager