import React, { useState } from "react";
import ListSubjects from "../../components/ListSubjects";
import UpdateDatabaseItem from "../../components/updateDatabaseItem";
import AddSubject from "../../components/addSubject";
import ListDatabaseItems from "../../components/listDatabaseItems";
import DeleteDatabaseItem from "../../components/deleteDatabaseItem";
// import ResourceCatalogue from "../components/resourceCatalogue";
import Layout from "../../components/layout";
import { Router, Link } from "@reach/router";
import firebase from 'firebase';
import SignInManager from "../../components/signInManager";
import { navigate } from "gatsby";


const AdminPage = () => {

  const SubjectList = () => <ListSubjects/>
  const AddNewSubject = () => <AddSubject/>
 
  const CategoryList = () => <ListDatabaseItems collection={"categories"} resourceEntry={"category"} editItem={editDatabaseItem} deleteItem={deleteDatabaseItem}/>
  const UpdateCategory = () => <UpdateDatabaseItem currentItem={currentItem}/>
  const DeleteCategory = () => <DeleteDatabaseItem currentItem={currentItem}/>
  
  const LevelList = () => <ListDatabaseItems collection={"levels"} resourceEntry={"level"} editItem={editDatabaseItem} deleteItem={deleteDatabaseItem}/>
  const UpdateLevel = () => <UpdateDatabaseItem currentItem={currentItem}/>
  const DeleteLevel = () => <DeleteDatabaseItem currentItem={currentItem}/>

  const TagList = () => <ListDatabaseItems collection={"tags"} resourceEntry={"tags"} editItem={editDatabaseItem} deleteItem={deleteDatabaseItem}/>
  const UpdateTag = () => <UpdateDatabaseItem currentItem={currentItem}/>
  const DeleteTag = () => <DeleteDatabaseItem currentItem={currentItem}/>

  // const ResourceCatalogue = () => <ResourceCatalogue downloadResource={downloadResource}/>

  const initialItemState = [{ id: null, name: "", image: "", description: "", category: "", level: "", tags: "", download: "" }]

  const [currentItem, setCurrentItem] = useState(initialItemState)
  const [user, setUser] = useState();
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUser(user)
    } else {
      setUser(user)
    }
  })

  const editDatabaseItem = (item, collection, location) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      location: location,
      collection: collection
    })

    navigate("/admin/categoryList/updateCategory")
  }

  const deleteDatabaseItem = (item, collection, location) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      location: location,
      collection: collection
    })

    navigate("/admin/categoryList/deleteCategory")
  }

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
            
              {/* <Link to="/admin/resourceCatalogue">Resource Catalogue</Link> */}
            <Router basepath="/admin">
              <SubjectList path="/"/>
              <SubjectList path="/subjectList"/>
              <AddNewSubject path="/subjectList/addSubject"/>
              
              <CategoryList path="/categoryList"/>

              <LevelList path="/levelList"/>

              <TagList path="/tagList"/>

              {/* <ResourceCatalogue path="/admin/resourceCatalogue"/> */}
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
