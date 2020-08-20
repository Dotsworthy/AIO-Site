import React, { useState } from "react"
import firebase from "firebase"

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
      firebase
        .firestore()
        .collection("items")
        .add({
          name,
          image,
          description,
          category,
          level,
          tags
        })
        //.then will reset the form to nothing
        .then(() => setName(""), setImage(""), setDescription(''), setCategory(""), setLevel(""), setTags(""))
    }
  
    return (
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
        <button>Submit</button>
      </form>
    )
  }

export default AddItemForm