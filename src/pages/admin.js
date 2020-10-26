import React, { useState } from "react"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import Layout from "../components/layout"
import { navigate } from "gatsby"
import { Router, Link } from "@reach/router"
import firebase from 'firebase';
import SignInManager from "../components/signInManager"

const AdminPage = () => {

  const SubjectList = () => <ListSubjects editItem={editItem}/>
  const AddSubject = () => <AddItemForm/>
  const UpdateSubject = () => <UpdateItem  currentItem={currentItem}/>

 const initialItemState = [{ id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" }]

  const [currentItem, setCurrentItem] = useState(initialItemState)

  const signIn = (email, password) => {
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      let errorCode = error.errorCode;
      let errorMessage = error.message;
    })
  }

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
    <nav className="admin-navigation-container">
    <Link to="/admin/subjectList">Subject List</Link>
    </nav>
    <SignInManager/>
    <Router>
        <SubjectList path="/admin/subjectList"/>
        <AddSubject path="/admin/subjectList/addSubject"/>
        <UpdateSubject path="/admin/updateSubject"/>
    </Router>
  </Layout>
  )
}

export default AdminPage
