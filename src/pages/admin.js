import React, { useState } from "react"
import firebase from "../components/firebase"
import ItemList from "../components/itemList"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import DeleteItem from "../components/deleteItem"
import Layout from "../components/layout"

const SecondPage = () => {

 const initialItemState = [
  { id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" },
  ]

  const [addResource, setAddResource] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
      download: item.download

    })
  }

  const deleteItem = item => {
    setDeleting(true)
    setCurrentItem({
      id: item.id,
      name: item.name,
      image: item.image,
      description: item.description,
      category: item.category,
      level: item.level,
      tags: item.tags,
      download: item.download

    })
  }

  const handleAddResourceClick = () => {
    setAddResource(true)
  }

  return (

  <Layout>
      <button onClick={handleAddResourceClick}>Add Resource</button>
      <ItemList editItem={editItem} deleteItem={deleteItem}/>
      {addResource && <AddItemForm setAddResource={setAddResource}/>}
      {editing && <UpdateItem 
      setEditing={setEditing}
      currentItem={currentItem}
      />}
      {deleting && <DeleteItem
      setDeleting={setDeleting}
      currentItem={currentItem}
      />}
  </Layout>
  )
}

export default SecondPage
