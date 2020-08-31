import React from "react"

const UpdateItem = () => {
  return (
    <>
      <h2>Update Item</h2>
      <form>
        <label htmlFor="Update Item">Update Item:</label>
        <input type="text" name="name" />
        <input type="text" name="type" />
        <input type="number" name="qty" />
        <input type="text" name="description" />
        <button>Update</button>
        <button>Cancel</button>
      </form>
    </>
  )
}
export default UpdateItem