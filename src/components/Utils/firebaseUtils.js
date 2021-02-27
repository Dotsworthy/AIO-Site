// import firebase from "firebase";
// import 'firebase/storage';

// const database = firebase.firestore()

// Looks for a resource with the name specified and returns the results in an array.
// export const databaseCheck = async (name, location) => {
//     let query = []
//     const snapshot = await database.collection(location).where("name", "==", name).get()
//     snapshot.forEach((doc) => query.push(doc))
//     return query
// }