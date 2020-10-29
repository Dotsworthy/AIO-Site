import React, { useState } from "react"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateitem"
import AddItemForm from "../components/addItemForm"
import Layout from "../components/layout"
import { Router, Link } from "@reach/router"
import firebase from 'firebase';
import SignInManager from "../components/signInManager"
import { navigate } from "gatsby"

const AdminPage = () => {

  const SubjectList = () => <ListSubjects editItem={editItem}/>
  const AddSubject = () => <AddItemForm/>
  const UpdateSubject = () => <UpdateItem  currentItem={currentItem}/>

  const initialItemState = [{ id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" }]

  const [currentItem, setCurrentItem] = useState(initialItemState)
  
  const user = firebase.auth().currentUser
  console.log(user);

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
    navigate("/admin/subjectList/updateSubject")
  }

  const logout = () => {
    firebase.auth().signOut().then(function() {
      console.log("code reached signout")
    }).catch(function(error) {
      const errorCode = error.code
      console.log(errorCode)
    })

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        return
      } else {
        window.location.replace("/admin")
      }
    })
  }

  return (

  <Layout>
    {user ? 
    <div>
      <nav className="admin-navigation-container">
        <Link to="/admin/subjectList">Subject List</Link>
        <button onClick={() => logout()}>Logout</button>
      </nav>

      <Router>
        <SubjectList path="/admin/subjectList"/>
        <AddSubject path="/admin/subjectList/addSubject"/>
        <UpdateSubject path="/admin/subjectList/updateSubject"/>
      </Router>

    </div>
  :
  <SignInManager/>
  }
    
  </Layout>
  )
}

export default AdminPage
