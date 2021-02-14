import React, { useState, useEffect } from "react";
import firebase from "firebase"

// Needs refactoring. Is firing off requests repeated causing a quota limit.
const RenderResourceNumber = ({ currentItem, resourceEntry }) => {

    const useItems = () => {
        const [items, setItems] = useState([]);
        useEffect(() => {
            if(resourceEntry === "tags") {
                firebase.firestore().collection("subjects").where(`${resourceEntry}`, "array-contains", `${currentItem.name}`).onSnapshot(snapshot => {
                    const listItems = snapshot.docs.map(doc => ({
                      id: doc.id,
                      ...doc.data()
                    }));
                    setItems(listItems);
                  });
            } else {
                firebase.firestore().collection("subjects").where(`${resourceEntry}`, "==", `${currentItem.name}`).onSnapshot(snapshot => {
                    const listItems = snapshot.docs.map(doc => ({
                      id: doc.id,
                      ...doc.data()
                    }));
                    setItems(listItems);
                  });
            }
        }, []);
        return items;
      };

    const resources = useItems()  

    return (
        <td> {resources.length} </td>
    )
}

export default RenderResourceNumber;