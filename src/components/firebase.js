import firebase from "firebase/app";
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBzTSJa3narKK7jvmZ449cBgMz8NXJq1V4",
    authDomain: "testproject-85401.firebaseapp.com",
    databaseURL: "https://testproject-85401.firebaseio.com",
    projectId: "testproject-85401",
    storageBucket: "testproject-85401.appspot.com",
    messagingSenderId: "497395027109",
    appId: "1:497395027109:web:3a4f65f77ed66d92e3914c",
    measurementId: "G-SNR4PBMFZ5"
  };

  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
  firebase.auth();

  export default firebase