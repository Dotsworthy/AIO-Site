import React, { useState } from 'react';
import firebase from 'firebase';

const SignInManager = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async e => {
        e.preventDefault()


        firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
          return firebase.auth().signInWithEmailAndPassword(email, password)
        })     
        .catch(function(error) {
          let errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
              alert('The password you entered is incorrect');
          }
          if (errorCode === 'auth/user-not-found') {
              alert('There is no user attached to this email address. To create a new user, please do this through firebase.')
          }
          if (errorCode === 'auth/invalid-email') {
              alert('The email address provided is invalid.')
          }
        })
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                window.location.replace("/admin")
            } else {
                return
            }
        })
      }

    return (
        <div className="small-form-container">
            <form onSubmit={onSubmit}>
                <input placeholder="email" type="text" id="email" value={email} onChange={e => setEmail(e.currentTarget.value)}></input>
                <input placeholder="password" type="password" id="password" value={password} onChange={e => setPassword(e.currentTarget.value)}></input>
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}

export default SignInManager