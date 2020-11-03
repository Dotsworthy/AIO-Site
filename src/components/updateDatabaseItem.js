import { navigate } from "gatsby";
import React, { useState, useEffect } from "react";
import firebase from "./firebase";


const UpdateDatabaseItem = ( { currentItem }) => {
    
    const [item, setItem] = useState(currentItem)
    // const [resources, setResources] = useState([])

    // useEffect(() => {
    //     const unsubscribe = firebase.firestore().collection("items").where(`${item.location}`, "==", `${item.name}`).onSnapshot(snapshot => {
    //       const listResources = snapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data()
    //       }))
    //       setResources(listResources);
    //     });
    //     return unsubscribe
    //   }) 

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
    console.log(resources)

    const updateResource = (resource, location) => {

        if (item.location === "category") {
            console.log("code reached")
            firebase.firestore().collection(location).doc(resource.id).update({category: item.name})
        }

        if (item.location === "level") {
            firebase.firestore().collection(location).doc(resource.id).update({level: item.name})
        }

        if (item.location === undefined) {
            return
        }

    }

    const onSubmit = e => {
        e.preventDefault()

        resources.map(resource => {
            return updateResource(resource, "items")
        })

        firebase.firestore().collection(item.collection).doc(item.id).update({name: item.name})
        
        navigate("/admin/categoryList")
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