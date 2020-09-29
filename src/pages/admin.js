import React, { useState } from "react"
import firebase from "../components/firebase"
import ItemList from "../components/itemList"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import Layout from "../components/layout"

const SecondPage = () => {
   /*
  We don't know what is going to be edited so we set an
  empty set for the <UpdateItem /> form
  */
 const initialItemState = [
  { id: null, name: "", image: "", description: "", category: "", level: "", tags: "" },
  ]
  /*
  Make a state for whether or not edit mode is turned on.
  It will begin as false.
  */
  const [addResource, setAddResource] = useState(false)
  const [editing, setEditing] = useState(false)
  /*
  Apply the empty initialItemState from above to a
  currentItem state. currentItem will be used for
  editing individual items. 
  */
  const [currentItem, setCurrentItem] = useState(initialItemState)

  const editItem = item => {
    setEditing(true)
    setCurrentItem({
      id: item.id,
      name: item.name,
      image: item.image,
      description: item.description,
      category: item.category,
      level: item.level,
      tags: item.tags,

    })
  }

  const updateItem = ({ currentItem }, updatedItem) => {
    console.log(
      "It sends the item to the updated item function:",
      updatedItem,
      currentItem.id
    );
    //When the Update button is pressed, it turns off editing
    setEditing(false)
    firebase
      .firestore()
      .collection("items")
      .doc(currentItem.id)
      .update(updatedItem);
  };

  const handleAddResourceClick = () => {
    setAddResource(true)
  }

  return (

  <Layout>
      <button onClick={handleAddResourceClick}>Add Resource</button>
      <ItemList editItem={editItem} />
      {addResource && <AddItemForm/>}
      {editing && <UpdateItem 
      setEditing={setEditing}
      currentItem={currentItem}
      updateItem={updateItem}
      />}
        {/* We add a ternary operator to switch
      between the UpdateItem form
      and the AddItemForm. */}
  </Layout>
  )
}

export default SecondPage
