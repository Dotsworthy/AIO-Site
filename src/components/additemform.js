import React, { useState } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = () => {

    const [name, setName] = useState("")
    // const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [tags, setTags] = useState("")
  
    const uploadFile = (file, location) => {
      const selectedFile = document.getElementById(file).files[0];
      const storageRef = firebase.storage().ref(`${location}/${selectedFile.name}`)
      storageRef.put(selectedFile)
    }

    const getUploadString = (file, location) => {
      const selectedFile = document.getElementById(file).files[0]
      return `${location}/${selectedFile.name}`
    }

    const onSubmit = e => {
      e.preventDefault()
      // Adding file to database
      uploadFile('image', 'images')
      uploadFile('download', 'downloads')
      const image = getUploadString('image', 'images')
      const download = getUploadString('download', 'downloads')
      
      //adding item to database 
      firebase
      .firestore()
      .collection("items")
      .add({
          name,
          image,
          description,
          category,
          level,
          tags,
          download
        })
      .then(() => setName(""), setDescription(''), setCategory(""), setLevel(""), setTags(""))
    }
 
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Add Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
          <div className="form-content">

            <div className="form-fields">
              <div>Resource Information</div>
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              <textarea className="input-description" placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              <input placeholder="Category" value={category} name="category" onChange={e => setCategory(e.currentTarget.value)} type="text"/>
              <input placeholder="Level"value={level} name="level" onChange={e => setLevel(e.currentTarget.value)} type="level"/>
              <input placeholder="Tags" value={tags} name="tags" onChange={e => setTags(e.currentTarget.value)} type="tags"/>
            </div>

            <div className="form-uploads">

              <div className="form-upload-container">
              <label for="image">Upload Image</label>
              <div className="form-preview"></div>
              <input placeholder="Image" id="image" name="image"type="file"/>
              </div>

              <div className="form-upload-container">
              <label for="download">Upload Resources</label>
              <input type="file" id="download" name="download"/>
              </div>

            </div>
          </div>

          <div className="form-submit">
            <button>Cancel</button>
            <button className="form-submit">Submit</button>
          </div>
        </form>
    </div>
    )
  }

export default AddItemForm