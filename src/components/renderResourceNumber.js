import React, { useState, useEffect } from "react";
import firebase from "firebase"

const RenderResourceNumber = ({ currentItem, resourceEntry }) => {

    const useItems = () => {
        const [items, setItems] = useState([]);
        useEffect(() => {
          firebase.firestore().collection("subjects").where(`${resourceEntry}`, "==", `${currentItem.name}`).onSnapshot(snapshot => {
              const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setItems(listItems);
            });
        }, []);
        return items;
      };

    const resources = useItems()  
    console.log(resources);


    return (
        <p> {resources.length} </p>
    )
}

export default RenderResourceNumber;