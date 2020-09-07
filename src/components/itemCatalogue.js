import React, { useState, useEffect } from "react"
import firebase from "./firebase"

const useItems = () => {
    const [items, setItems] = useState([]); //useState() hook, sets initial state to an empty array
    useEffect(() => {
      firebase
        .firestore() //access firestore
        .collection("items") //access "items" collection
        .onSnapshot(snapshot => {
          //You can "listen" to a document with the onSnapshot() method.
          const listItems = snapshot.docs.map(doc => ({
            //map each document into snapshot
            id: doc.id, //id and data pushed into items array
            ...doc.data() //spread operator merges data to id.
          }));
          setItems(listItems); //items is equal to listItems
        });
        //called the unsubscribe--closing connection to Firestore.
        // return () => unsubscribe()
    }, []);
    return items;
}

const ItemCatalogue = () => {
    const listItem = useItems();
  return (
      <div className ="resource-page-items">
    {listItem.map(item => (
      <div className={`${item.category} catalogue-item filter-item`}>
            <h3>{item.name}</h3>
            <div className="catalogue-image-container">
            <img className="catalogue-image" src={item.image}></img>
            </div>
            <div className="catalogue-button">
            <button>More Info</button>
            <button>Download</button>
            </div>
      </div>      
    ))}
    </div>
  ) 
}  

export default ItemCatalogue