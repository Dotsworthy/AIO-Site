import React, { useState, useEffect } from "react"
import firebase from "./firebase"

const db = firebase.firestore()

const ListDatabaseItems = ( { collection, resourceEntry, editItem } ) => {
    const [items, setItems] = useState([])
    // const [resources, setResources] = useState([])
    // const [deleting, setDeleting] = useState(false)
    // const [editing, setEditing] = useState(false)

    const resources = []

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

    const addResourcesAttached = async (item) => {

        const resourcesRef = db.collection("items")
        const snapshot = await resourcesRef.where(`${resourceEntry}`, "==", `${item.name}`).get();
        
        if (snapshot.empty) {
            return
        } else {
            
            snapshot.forEach(doc => {
            resources.push({...doc.data()})
            })
        }
    }

    items.map(item => {
        addResourcesAttached(item);
    })

    const getResourcesAttached = (category) => {
        const result = resources.filter(resource => {
            // console.log("code reached")
            // console.log(resource);
            return resource.category == category;
        })
        // console.log(resources)
        // console.log(result)
        return result.length;
    }


    
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
                
                <td className="item-resources-attached">{getResourcesAttached(item.name)}</td>
                <td className="buttons">
                    <button onClick={() => editItem(item, collection, resourceEntry)}>Edit</button>
                    {/* <button onClick={() => deleteItem(item)}>Delete</button> */}
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    </div>
    )
}

export default ListDatabaseItems