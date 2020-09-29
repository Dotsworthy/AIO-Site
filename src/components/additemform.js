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
      // const selectedFile = document.getElementById('fileUpload').files[0];
      // const storageRef = firebase.storage().ref(`downloads/${selectedFile.name}`)
      // storageRef.put(selectedFile)
      // const download = `downloads/${selectedFile.name}`
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
          <div className="database-form-content">
        <h2>Add Resource</h2>
        <form className="form-container" onSubmit={onSubmit}>
        
        <div className="form-fields">
        <input placeholder="Name"
          value={name}
          name="name"
          /* onChange takes the event and set it to whatever
          is currently in the input. 'e' is equal to the event
          happening. currentTarget.value is what is inputted
           */
          onChange={e => setName(e.currentTarget.value)}
          type="text"
        />

        <input placeholder="Description"
          value={description}
          name="Description"
          onChange={e => setDescription(e.currentTarget.value)}
          type="text"
        />
        <input placeholder="Category"
          value={category}
          name="category"
          onChange={e => setCategory(e.currentTarget.value)}
          type="text"
        />
        <input placeholder="Level"
        value={level}
        name="level"
        onChange={e => setLevel(e.currentTarget.value)}
        type="level"
        />
        <input placeholder="Tags"
        value={tags}
        name="tags"
        onChange={e => setTags(e.currentTarget.value)}
        type="tags"
        />
        </div>

        <div className="form-uploads">
        <input placeholder="Image"
          id="image"
          name="image"
          type="file"
        />
        <label for="image">Upload Image</label>

        <input
        type="file"
        id="download"
        name="download"
        />
        <label for="download">Upload teaching resources</label>
        </div>

        <button className="form-submit">Submit</button>
      </form>
        </div>
      </div>
    )
  }

export default AddItemForm