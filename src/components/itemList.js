import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

const ItemList = ( { editItem, deleteItem } ) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    firebase
    .firestore()
    .collection("items")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setResources(listResources);
    })
  }, [])
  
  return (
    <div>
    <table className="resource-database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Resource Name</th>
          <th className="category">Category</th>
          <th className="level">Level</th>
          <th className="tags">Tags</th>
        </tr>
      </tbody>
      {resources.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="resource-name">{item.name}</td>
                <td className="category">{item.category}</td>
                <td className="level">{item.level}</td>
                <td className="tags">{item.tags.toString()}</td>
                <td className="buttons">
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item)}>Delete</button>
                    
                    
                </td>
              </tr>
            </tbody>
          ))}
    </table>
    </div>
  )
}

export default ItemList