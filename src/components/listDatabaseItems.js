import React, { useState, useEffect } from "react"
import firebase from "./firebase"

// const db = firebase.firestore()

const ListDatabaseItems = ( { collection, resourceEntry, editItem, deleteItem } ) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection(`${collection}`).orderBy("name").onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setItems(listItems);
        });
        return unsubscribe
      }, [collection])

    // The functions below were used to render the number of resources attached. Currently non-working.

    // const resources = []
    
    // const addResourcesAttached = async (item) => {
    //   const resources = []
    //   const resourcesRef = db.collection("items")
    //   await resourcesRef.where(`${resourceEntry}`, "==", `${item}`).get().then(function(querySnapshot) {
    //     if (querySnapshot.empty) {
    //       return
    //   } else {
    //       querySnapshot.forEach(doc => {
    //       resources.push({...doc.data()})
    //       })}
    //   }
    //   ).catch(function(error) {
    //     console.log("Error getting documents: ", error)
    //   });
    //   return resources
    // }
  
    // const getResourcesAttached = async (category) => {
    //   const result = await
    //   addResourcesAttached(category).then(value => {
    //     return value
    //   })
    //   const resourcesAttached = result.length
    //   return resources.push({category, resourcesAttached})
    // }  

    return (
    <div>
        <table className="database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Name</th>
        </tr>
      </tbody>
      {items.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="item-name">{item.name}</td>
                <td className="buttons">
                    <button onClick={() => editItem(item, collection, resourceEntry)}>Edit</button>
                    <button onClick={() => deleteItem(item, collection, resourceEntry)}>Delete</button>
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    </div>
    )
}

export default ListDatabaseItems