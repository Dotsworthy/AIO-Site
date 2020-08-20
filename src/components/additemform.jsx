import React, { useState } from "react"
import firebase from "firebase"

const AddItemForm = () => {

  return (
    <form>
      <input name="name" type="text" />
      <input name="type" type="text" />
      <input name="qty" type="number" />
      <input name="description" type="text" />
      <button>Submit</button>
    </form>
  )
}
export default AddItemForm