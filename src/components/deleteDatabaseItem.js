import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { navigate } from "gatsby";

const DeleteDatabaseItem = ({currentItem}) => {
    
    const [item, setItem] = useState(currentItem)
    
    const useItems = () => {
        const [items, setItems] = useState([])
        useEffect(() => {
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
        },[])    
        return items    
    }  

    const resources = useItems();

    const deleteItem = () => {
        firebase
        .firestore()
        .collection("categories")
        .item(item.id)
        .delete()

        navigate("/admin/categoryList")
    }
    
    return (
        <form>
            <div>
                <h2>Delete Item</h2>
            {resources > 0 ? 
                <div>
                    <h3>Items attached to resources!</h3>
                    <p>You cannot delete this database item as it is attached to resources in the database. You must first assign new items to these resources:</p>
                {resources.map(resource => {
                    return <p>{resource.name}</p>
                })
                }
               
                </div>
            : 
            <button onClick={()=>deleteItem()}>Delete Item</button>   
        }  
        </div> 
        </form>
    )
}

export default DeleteDatabaseItem