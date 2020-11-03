import React, { useState, useEffect } from "react";
import firebase from "./firebase";


const UpdateDatabaseItem = ( { currentItem }) => {
    
    const [item, setItem] = useState(currentItem)

    const useItems = (item, location, value) => {
        const [items, setItems] = useState([]);
        useEffect(() => {
          firebase
            .firestore()
            .collection(location)
            .where(`${value}`, "==", `${item.name}`)
            .onSnapshot(snapshot => {
              const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setItems(listItems);
            });
            //called the unsubscribe--closing connection to Firestore.
            // return () => unsubscribe()
        }, []);
        return items;
      };

      const resources = useItems(item, "items", item.collection)
      console.log(resources)  

    const onSubmit = e => {
        e.preventDefault()



        return
    }

    const onChange = e => {
        const { name, value } = e.target
        setItem({ ...item, [name]: value })
      }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" value={item.name} onChange={onChange} />
                <button type="submit" >Update</button>
            </form>
        </div>
    )
}

export default UpdateDatabaseItem