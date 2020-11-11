import React from "react";
import firebase from "firebase"
import 'firebase/storage'

const DeleteResource = ({ currentResource, setDeleting }) => {

    const resource = currentResource

    // const deleteItem = (id, imageRef, downloadRef, imageLocation, downloadLocation) => {
    //     deleteFile(imageRef, id, imageLocation)
    //     deleteAllFiles(downloadRef, id, downloadLocation)
    
    //     firebase
    //       .firestore()
    //       .collection("items")
    //       .doc(id)
    //       .delete()
    //   } 

    const onSubmit = e => {
      e.preventDefault()
      deleteFile(resource.image, resource.id, "images")
      deleteAllFiles(resource.download, resource.id, "downloads")

      firebase
      .firestore()
      .collection("items")
      .doc(resource.id)
      .delete()

      setDeleting(false)
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
        <form onSubmit={onSubmit}>
        <p>Are you sure you want to delete this resource? This cannot be reversed!</p>
        <button type="button" onClick={() => setDeleting(false)}>Cancel</button>
        <button type="submit">Confirm</button>
        </form>
    )
}

export default DeleteResource