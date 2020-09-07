import React, { useState } from "react"
import firebase from "firebase"

const AddCategoryForm = () => {

    const [name, setName] = useState("")
  
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
        .collection("categories")
        .add({
          name
        })
        //.then will reset the form to nothing
        .then(() => setName(""))
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
        <button>Submit</button>
      </form>
    )
  }

export default AddCategoryForm