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
  

  // const deleteItem = (id, imageRef, downloadRef, imageLocation, downloadLocation) => {
  //   deleteFile(imageRef, id, imageLocation)
  //   deleteAllFiles(downloadRef, id, downloadLocation)

  //   firebase
  //     .firestore()
  //     .collection("items")
  //     .doc(id)
  //     .delete()
  // }  

  // const deleteFile = (file, id, location) => {
  //   const storageRef = firebase.storage().ref()
  //   const fileRef = storageRef.child(`${location}/${id}/${file}`)
  //   fileRef.delete().then(function() {
  //     console.log("resource deleted successfully")
  //   }).catch(function(error) {
  //     console.log(error)
  //   })
  // }

  // const deleteAllFiles = (file, id, location) => {
  //   const storageRef = firebase.storage().ref()
  //   file.forEach(download => {
  //     const fileRef = storageRef.child(`${location}/${id}/${download}`)
  //     fileRef.delete().then(function() {
  //       console.log("resource deleted successfully")
  //     }).catch(function(error) {
  //       console.log(error)
  //     })
  //   })

  //   setDeleteWarning(false);
  // }

  // const handlePopup = (e) => {
  //   e.preventDefault();
  //   setDeleteWarning(true);
  // }
  
  return (
    <div>
    <table className="resource-database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Resource Name</th>
          {/* <th className="description">Description</th> */}
          {/* <th className="category">Category</th>
          <th className="level">Level</th>
          <th className="tags">Tags</th> */}
        </tr>
      </tbody>
      {resources.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="resource-name">{item.name}</td>
                {/* <td className="description">{item.description}</td> */}
                {/* <td className="category">{item.category}</td>
                <td className="level">{item.level}</td> */}
                {/* <td className="tags">{item.tags}</td> */}
                <td className="buttons">
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item)}>Delete</button>
{/* 
                    {deleteWarning && 
                    <div>
                    <p>Are you sure you want to delete this resource? This cannot be reversed!</p>
                    <button onClick={() => setDeleteWarning(false)}>Cancel</button>
                    <button onClick={() => deleteItem(item.id, item.image, item.download, "images", "downloads")}>Confirm</button>
                    </div>
                    } */}
                    
                    
                </td>
              </tr>
            </tbody>
          ))}
    </table>
    </div>
  )
}

export default ItemList