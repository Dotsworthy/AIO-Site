import firebase from "firebase/app";
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// firebase config for main app
var firebaseConfig = {
 apiKey: "AIzaSyAWAgYTE1z0CzHB3Nl2BYCUQfwbIOiOvmM",
 authDomain: "aio-resource-database.firebaseapp.com",
 projectId: "aio-resource-database",
 storageBucket: "aio-resource-database.appspot.com",
 messagingSenderId: "810036207784",
 appId: "1:810036207784:web:ba499b1c7d3969d32ae29d",
 measurementId: "G-PMX938KB3B"
};


// Test Database
// var firebaseConfig = {
//   apiKey: "AIzaSyBzTSJa3narKK7jvmZ449cBgMz8NXJq1V4",
//   authDomain: "testproject-85401.firebaseapp.com",
//   databaseURL: "https://testproject-85401.firebaseio.com",
//   projectId: "testproject-85401",
//   storageBucket: "testproject-85401.appspot.com",
//   messagingSenderId: "497395027109",
//   appId: "1:497395027109:web:3a4f65f77ed66d92e3914c",
//   measurementId: "G-SNR4PBMFZ5"
// };

  firebase.initializeApp(firebaseConfig);
  firebase.auth();

  export default firebase

