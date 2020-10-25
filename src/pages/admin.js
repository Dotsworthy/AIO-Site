import React, { useState } from "react"
import firebase from "../components/firebase"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import DeleteItem from "../components/deleteItem"
import Layout from "../components/layout"
import { navigate } from "gatsby"
import { Router, Link } from "@reach/router"

import UpdateSubject from "./updateSubject"

const AdminPage = () => {

  const SubjectList = () => <ListSubjects/>
  const AddSubject = () => <AddItemForm/>

 const initialItemState = [
  { id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" },
  ]

  const [addResource, setAddResource] = useState(false)
  // const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [currentItem, setCurrentItem] = useState(initialItemState)

  const editItem = item => {
    // setEditing(true)
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
    navigate("/updateSubject")
  }

  return (

    

  <Layout>
    <Link to="/admin/subjectList">Subject List</Link>

    <Router>
        <SubjectList path="/admin/subjectList"/>
          <AddSubject path="/admin/subjectList/addSubject"/>
          <UpdateSubject path="/admin/updateSubject/:subjectId"/>
    </Router>

    


      {/* <div className="database-navigation-bar">
        <nav> */}
          {/* <Link className="database-navigation-button" to="addSubject">Add Subject</Link> */}
        {/* </nav>
      </div> */}
      {/* <ItemList editItem={editItem} deleteItem={deleteItem}/> */}

      {/* {deleting && <DeleteItem
      setDeleting={setDeleting}
      currentItem={currentItem}
      />} */}
  </Layout>
  )
}

export default AdminPage
