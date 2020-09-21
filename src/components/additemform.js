import React, { useState } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = () => {

    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [tags, setTags] = useState("")
  
    /* The onSubmit function we takes the 'e'
      or event and submits it to Firebase
      */
    const onSubmit = e => {
      /* 
      preventDefault is important because it
      prevents the whole page from reloading
      */
      e.preventDefault()
      const selectedFile = document.getElementById('fileUpload').files[0];
      const storageRef = firebase.storage().ref(`downloads/${selectedFile.name}`)
      storageRef.put(selectedFile)
      const download = `downloads/${selectedFile.name}`
      console.log(download)
  
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
      .then(() => setName(""), setImage(""), setDescription(''), setCategory(""), setLevel(""), setTags(""))
    }
 
    return (
        <div>
        <h2>Add Resource</h2>
        <form onSubmit={onSubmit}>
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
        <input placeholder="Image"
          value={image}
          name="image"
          onChange={e => setImage(e.currentTarget.value)}
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

        <input
        // value={download}
        type="file"
        id="fileUpload"
        // onChange={e => setDownload(getFile())}
        />

        <button>Submit</button>
      </form>
      </div>
    )
  }

export default AddItemForm