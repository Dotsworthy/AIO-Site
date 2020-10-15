import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'

const DeleteItem = ({ currentItem, setDeleting }) => {

    const [item] = useState(currentItem)

    const deleteItem = (id, imageRef, downloadRef, imageLocation, downloadLocation) => {
        deleteFile(imageRef, id, imageLocation)
        deleteAllFiles(downloadRef, id, downloadLocation)
    
        firebase
          .firestore()
          .collection("items")
          .doc(id)
          .delete()
      }  
    
      const deleteFile = (file, id, location) => {
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(`${location}/${id}/${file}`)
        fileRef.delete().then(function() {
          console.log("resource deleted successfully")
        }).catch(function(error) {
          console.log(error)
        })
      }
    
      const deleteAllFiles = (file, id, location) => {
        const storageRef = firebase.storage().ref()
        file.forEach(download => {
          const fileRef = storageRef.child(`${location}/${id}/${download}`)
          fileRef.delete().then(function() {
            console.log("resource deleted successfully")
          }).catch(function(error) {
            console.log(error)
          })
        })
    
        setDeleting(false);
      }

    return (
        <div>
        <p>Are you sure you want to delete this resource? This cannot be reversed!</p>
        <button onClick={() => setDeleting(false)}>Cancel</button>
        <button onClick={() => deleteItem(item.id, item.image, item.download, "images", "downloads")}>Confirm</button>
        </div>
    )
}

export default DeleteItem