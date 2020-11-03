import React, { useState, useEffect } from "react"
import firebase from "./firebase"

const ListDatabaseItems = ( { collection, resourceEntry, editItem } ) => {
    const [items, setItems] = useState([])
    const [deleting, setDeleting] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection(`${collection}`).onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setItems(listItems);
        });
        return unsubscribe
      }, [])
    
    const deleteItem = (item) => {
      setDeleting(true)  
    }
    
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
                <td className="resource-name">{item.name}</td>
                <td className="buttons">
                    <button onClick={() => editItem(item, resourceEntry)}>Edit</button>
                    <button onClick={() => deleteItem(item)}>Delete</button>
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    </div>
    )
}

export default ListDatabaseItems