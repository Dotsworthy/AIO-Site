import React, { useState } from "react"
import firebase from "../components/firebase"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import DeleteItem from "../components/deleteItem"
import Layout from "../components/layout"
import { navigate } from "gatsby"
import { Router, Link } from "@reach/router"

const AdminPage = () => {

  const SubjectList = () => <ListSubjects editItem={editItem}/>
  const AddSubject = () => <AddItemForm/>
  const UpdateSubject = () => <UpdateItem  currentItem={currentItem}/>

 const initialItemState = [{ id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" }]

  const [currentItem, setCurrentItem] = useState(initialItemState)

  const editItem = item => {
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
    navigate(`/admin/updateSubject`)
  }

  return (

  <Layout>
    <nav>
    <Link to="/admin/subjectList">Subject List</Link>
    </nav>
    <Router>
        <SubjectList path="/admin/subjectList"/>
        <AddSubject path="/admin/subjectList/addSubject"/>
        <UpdateSubject path="/admin/updateSubject"/>
    </Router>
  </Layout>
  )
}

export default AdminPage
