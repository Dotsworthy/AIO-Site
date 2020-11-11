import React from "react";
import firebase from "firebase"
import 'firebase/storage'

const DeleteResource = ({ currentResource, setDeleting }) => {

  const resource = currentResource

  const onSubmit = async e => {
    e.preventDefault()
    await deleteFile(resource.image, resource.id, "images")
    await deleteAllFiles(resource.download, resource.id, "downloads")

    firebase
    .firestore()
    .collection("items")
    .doc(resource.id)
    .delete()

    setDeleting(false)
  }  
  
  // deletes a single file within a folder in firebase storage
  const deleteFile = async (file, id, location) => {
    const storageRef = firebase.storage().ref()
    const fileRef = storageRef.child(`${location}/${id}/${file}`)
    fileRef.delete().then(function() {
      console.log("resource deleted successfully")
    }).catch(function(error) {
      console.log(error)
    })
  }
  
  // deletes all files within a folder in firebase storage
  const deleteAllFiles = async (file, id, location) => {
    const storageRef = firebase.storage().ref()
    file.forEach(download => {
      const fileRef = storageRef.child(`${location}/${id}/${download}`)
      fileRef.delete().then(function() {
        console.log("resource deleted successfully")
      }).catch(function(error) {
        console.log(error)
      })
    })
  }

  return (
      <form onSubmit={onSubmit}>
      <p>Are you sure you want to delete this resource? This cannot be reversed!</p>
      <button type="button" onClick={() => setDeleting(false)}>Cancel</button>
      <button type="submit">Confirm</button>
      </form>
  )
}

export default DeleteResource