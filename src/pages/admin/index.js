import React, { useState } from "react";
import ListSubjects from "../../components/ListSubjects";
import AddSubject from "../../components/addSubject";
import ListDatabaseItems from "../../components/listDatabaseItems";
import Layout from "../../components/layout";
import { Router, Link } from "@reach/router";
import firebase from 'firebase';
import SignInManager from "../../components/signInManager";

// Move addSubject to 

const AdminPage = () => {

  const SubjectList = () => <ListSubjects/>
  const AddNewSubject = () => <AddSubject/>
  const CategoryList = () => <ListDatabaseItems collection={"categories"} resourceEntry={"category"}/>
  const LevelList = () => <ListDatabaseItems collection={"levels"} resourceEntry={"level"} />
  const TagList = () => <ListDatabaseItems collection={"tags"} resourceEntry={"tags"} />

  const [user, setUser] = useState();
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUser(user)
    } else {
      setUser(user)
    }
  })

  const logout = () => {
    firebase.auth().signOut().then(function() {
      console.log("code reached signout")
    }).catch(function(error) {
      const errorCode = error.code
      console.log(errorCode)
    })
  }

  return (
  <div>
      {user ?     
        <Layout siteType="admin">
          <div className="admin-layout">
          <div
           className="admin-subnav"
           >
              <button onClick={() => logout()}>Logout</button>
          </div>

            <Router basepath="/admin">
              <SubjectList path="/"/>
              <SubjectList path="/subjectList"/>
              <AddNewSubject path="/subjectList/addSubject"/>
              <CategoryList path="/categoryList"/>
              <LevelList path="/levelList"/>
              <TagList path="/tagList"/>

            </Router> 
          </div>
        </Layout>
    :
    <Layout siteType={"client"}>
    <SignInManager/>
    </Layout>
    }
      
    
  </div>
  )
}

export default AdminPage
