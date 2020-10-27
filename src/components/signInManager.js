import React, { useState } from 'react';
import firebase from 'firebase';

const SignInManager = ({ setLoggedIn }) => {

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
        setLoggedIn(true);
      }

    return (
        <div className="small-form-container">
            <form>
            <input placeholder="email" type="text" id="email" value={email} onChange={e => setEmail(e.currentTarget.value)}></input>
            <input placeholder="password" type="password" id="password" value={password} onChange={e => setPassword(e.currentTarget.value)}></input>
            <button onClick={() => signIn(email, password)}>Sign In</button>
            </form>
        </div>
    )
}

export default SignInManager