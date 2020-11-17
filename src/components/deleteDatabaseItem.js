import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { navigate } from "gatsby";

const DeleteDatabaseItem = ({currentItem}) => {
    
    const [item, setItem] = useState(currentItem)
    
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

    const resources = useItems();

    const onSubmit = e => {
        e.preventDefault()
        firebase
        .firestore()
        .collection(`${item.collection}`)
        .doc(item.id)
        .delete()

        if (item.collection === "categories") {
            navigate("/admin/categoryList")
        }

        if (item.collection === "levels") {
            navigate("/admin/levelList")
        }

        if (item.collection === "tags") {
            navigate("/admin/tagList")
        }
        
    }
    
    return (
        <form onSubmit={onSubmit}>
            <div>
                <h2>Delete Item</h2>
            {resources.length > 0 ? 
                <div>
                    <h3>Items attached to resources!</h3>
                    <p>You cannot delete this database item as it is attached to resources in the database. You must first assign new items to these resources:</p>
                {resources.map(resource => {
                    return <p>{resource.name}</p>
                })
                }
               
                </div>
            : 
            <button type="submit">Delete Item</button>   
        }  
        </div> 
        </form>
    )
}

export default DeleteDatabaseItem