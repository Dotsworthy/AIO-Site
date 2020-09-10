import React from 'react';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// const firebaseApp = firebase.initializeApp({ projectId: PROJECT_ID }, SECONDARY_APP_ID);
// const firestore = firebaseApp.firestore();
// firestore.settings({ host: "localhost:8080", ssl: false });