import React, { useState, useEffect } from "react"
import firebase from "./firebase"

// const db = firebase.firestore()

const ListDatabaseItems = ( { collection, resourceEntry, editItem, deleteItem } ) => {
    const [items, setItems] = useState([])
    const [searchTerm, setSearchTerm] = useState(null)

    useEffect(() => {
      if (searchTerm) {
        const unsubscribe = firebase.firestore().collection(`${collection}`).where("name", "==", searchTerm).onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setItems(listItems);
        });
        return unsubscribe
      } else {
        const unsubscribe = firebase.firestore().collection(`${collection}`).orderBy("name").onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setItems(listItems);
        });
        return unsubscribe
      }
        
      }, [searchTerm])

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
    const onSubmit = e => {
      e.preventDefault()
      const element = document.getElementById("search").value
      setSearchTerm(element);
    }

    return (
    <div className="database-container">
      <form onSubmit={onSubmit} className="nav-bar-form">
    <input type="text" id="search" name="search" placeholder="Search"/>
    <button type="submit">Search</button>
    <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
    </form>
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