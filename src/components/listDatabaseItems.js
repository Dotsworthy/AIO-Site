import React, { useState, useEffect } from "react"
import firebase from "./firebase"

const db = firebase.firestore()

const ListDatabaseItems = ( { collection, resourceEntry, editItem, deleteItem } ) => {
    const [items, setItems] = useState([])
    // const [resources, setResources] = useState([])
    // const [deleting, setDeleting] = useState(false)
    // const [editing, setEditing] = useState(false)

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection(`${collection}`).onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setItems(listItems);
        });
        return unsubscribe
      }, [collection])
    
    // const deleteItem = (item) => {
    //   setDeleting(true)  
    // }
  
    const resources = []  



    const addResourcesAttached = async (item) => {

        const resources = []
        const resourcesRef = db.collection("items")
        const snapshot = await resourcesRef.where(`${resourceEntry}`, "==", `${item}`).get();
        
        if (snapshot.empty) {
            return
        } else {
            
            snapshot.forEach(doc => {
            resources.push({...doc.data()})
            })
        }
        // console.log(resources)
        return resources
    }

    const getResourcesAttached = async (category) => {
      const result = await
      addResourcesAttached(category).then(value => {
        return value
      })
      return result
    }

    items.map(item => {
      const result = getResourcesAttached(item.name)
    })

    console.log(resources)
    
    return (
    <div>
        <table className="database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Name</th>
          <th className="resources-attached">Resources Attached</th>
        </tr>
      </tbody>
      {items.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="item-name">{item.name}</td>
                
                <td className="item-resources-attached">0</td>
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