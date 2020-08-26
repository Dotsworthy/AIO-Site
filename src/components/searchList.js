import React, { useState, useEffect } from "react"
import firebase from "./firebase"

const useItems = () => {
    const [categories, setItems] = useState([]); //useState() hook, sets initial state to an empty array
    useEffect(() => {
      firebase
        .firestore() //access firestore
        .collection("categories") //access "items" collection
        .onSnapshot(snapshot => {
          //You can "listen" to a document with the onSnapshot() method.
          const listCategories = snapshot.docs.map(doc => ({
            //map each document into snapshot
            id: doc.id, //id and data pushed into items array
            ...doc.data() //spread operator merges data to id.
          }));
          setItems(listCategories); //items is equal to listItems
        });
        //called the unsubscribe--closing connection to Firestore.
        // return () => unsubscribe()
    }, []);
    return categories;
}

const SearchList = () => {
    const listCategory = useItems();
    return (
        <div className="resource-page-search">
            {listCategory.map(category => (
                <p>{category.name}</p>
            ))}
        </div>
    )
}

export default SearchList;