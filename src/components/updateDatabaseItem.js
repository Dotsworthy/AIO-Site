import { navigate } from "gatsby";
import React, { useState, useEffect } from "react";
import firebase from "./firebase";


const UpdateDatabaseItem = ( { setEditing, currentItem }) => {
    
    // Used for updating the database item.
    const [item, setItem] = useState(currentItem);
    const originalTag = currentItem.name;

    // Retrieves resources in the database that include the selected database item.
    const useItems = () => {
        const [items, setItems] = useState([])
        useEffect(() => {
        if (item.location === "tags") {
            
                const unsubscribe = firebase
                .firestore()
                .collection("items")
                .where(`${item.location}`, "array-contains", `${item.name}`)
                .onSnapshot(function(snapshot) {
                    const listItems = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    setItems(listItems)
                });
                return unsubscribe;
            } else {
                const unsubscribe = firebase
                .firestore()
                .collection("items")
                .where(`${item.location}`, "==", `${item.name}`)
                .onSnapshot(function(snapshot) {
                    const listItems = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    setItems(listItems)
                });
                return unsubscribe;
            }
        },[])    
        return items      
    } 

    // Collects and stores the resources that include the database item.
    const resources = useItems();
    
    // Updates resources in the database to include the new database item.
    const updateResource = (resource, location) => {

        // Firebase cannot use variables for database entries, so we need seperate if functions for categories and levels
        if (item.location === "category") {
            firebase.firestore().collection(location).doc(resource.id).update({category: item.name})
        }

        if (item.location === "level") {
            firebase.firestore().collection(location).doc(resource.id).update({level: item.name})
        }

        // Tags are updated differently as it is an array.
        if (item.location === "tags") {
            firebase.firestore().collection(location).doc(resource.id).update({tags: firebase.firestore.FieldValue.arrayRemove(`${originalTag}`)})
            firebase.firestore().collection(location).doc(resource.id).update({tags: firebase.firestore.FieldValue.arrayUnion(`${item.name}`)})
        }

        // To prevent errors
        if (item.location === undefined) {
            return
        }
    }

    // Updates the database item.
    const onSubmit = e => {
        e.preventDefault()

        resources.map(resource => {
            return updateResource(resource, "items")
        })

        firebase.firestore().collection(item.collection).doc(item.id).update({name: item.name})
        
        setEditing(false);
    }

    const onChange = e => {
        const { name, value } = e.target
        setItem({ ...item, [name]: value })
      }

    const handleCancel = (e) => {
        e.preventDefault()
        setEditing(false)
    }  

    return (
        <div className="database-container">
            <form className="small-database-form" onSubmit={onSubmit}>
                
                <div className="form-header"><h2>Update {currentItem.location}</h2></div>
            
                <div className="form-container">
                    <div><p>Updaing this {currentItem.location} will update all resources that have this {currentItem.location} attached.</p></div>
                    <input type="text" name="name" value={item.name} onChange={onChange} />
                <div className="form-footer">
                    <button onClick={(e) => handleCancel(e)}>Cancel</button>
                    <button type="submit" >Update</button>
                </div>
                </div>
            </form>
            
        </div>
    )
}

export default UpdateDatabaseItem