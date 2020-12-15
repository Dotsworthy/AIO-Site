import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'

const DeleteSubject = ({ currentItem, setDeleting }) => {

  // Resource for deletion
  const resource = currentItem;
  console.log(resource);

  // generates notification for user that resource is in process of deletion
  const [waiting, setWaiting] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    setWaiting(true);

    // function waits for these to complete before continuing.
    await deleteFile(resource.image, resource.id, "images")
    await deleteAllFiles(resource.download, resource.id, "downloads")

    firebase
    .firestore()
    .collection("subjects")
    .doc(resource.id)
    .delete()

    setDeleting(false)
  }  
  
  // deletes a single file within a folder in firebase storage
  const deleteFile = async (file, id, location) => {
    const string = `${location}/${id}/${file}`
    const storageRef = firebase.storage().ref()
    if (file = "") {
      console.log("no file?")
      return
    } else {
      const fileRef = storageRef.child(`${string}`)
      fileRef.delete().then(function() {
        console.log("resource deleted successfully")
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
  
  // deletes all files within a folder in firebase storage
  const deleteAllFiles = async (file, id, location) => {
    const storageRef = firebase.storage().ref()
    if (file = "") {
      console.log("no id?")
      return
    } else if (file.length == 0) {
      console.log("no length?")
      return
    } else {
      console.log("code-reached")
      file.forEach(download => {
        const fileRef = storageRef.child(`${location}/${id}/${download}`)
        fileRef.delete().then(function() {
          console.log("resource deleted successfully")
        }).catch(function(error) {
          console.log(error)
        })
      })
    }
  }

  return (
    <div className="popup-container">
      <div className="form-header">
        <h2>Confirm Delete?</h2>
      </div>
      <form className="popup-content" onSubmit={onSubmit}>
      { waiting ? 
      <p>Deleting Resource...</p>  
      :
      <p>Are you sure you want to delete this resource? This cannot be reversed!</p>
      }
      <button type="button" onClick={() => setDeleting(false)}>Cancel</button>
      <button type="submit">Confirm</button>
      </form>
    </div>
  )
}

export default DeleteSubject