import React, { useState } from 'react';
import firebase from 'firebase';

const SignInManager = ({ loggedIn }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // const ui = new firebaseui.auth.AuthUI(firebase.auth())

    // ui.start('#firebaseui-auth-container', {
    //     signInOptions: [
    //         // firebase.auth.EmailAuthProvider.Provider_ID
    //     ],
    // });

    const signIn = (email, password) => {
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
          let errorCode = error.errorCode;
          let errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
        })
      }

    return (
        <div className="small-form-container">
            <input placeholder="email" type="text" id="email" value={email} onChange={e => setEmail(e.currentTarget.value)}></input>
            <input placeholder="password" type="password" id="password" value={password} onChange={e => setPassword(e.currentTarget.value)}></input>
            <button onClick={() => signIn(email, password)}>Sign In</button>
        </div>
    )
}

export default SignInManager