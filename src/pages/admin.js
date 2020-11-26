import React, { useState } from "react"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateItem"
import UpdateDatabaseItem from "../components/updateDatabaseItem"
import AddItemForm from "../components/addItemForm"
import ListDatabaseItems from "../components/listDatabaseItems";
import DeleteDatabaseItem from "../components/deleteDatabaseItem";
// import ResourceCatalogue from "../components/resourceCatalogue";
import Layout from "../components/layout"
import { Router, Link } from "@reach/router"
import firebase from 'firebase';
import SignInManager from "../components/signInManager"
import { navigate } from "gatsby"


const AdminPage = () => {

  const SubjectList = () => <ListSubjects editItem={editItem}/>
  const AddSubject = () => <AddItemForm/>
  const UpdateSubject = () => <UpdateItem  currentItem={currentItem}/>
 
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
      <div>
        <nav className="admin-header">

          <div>
            <h1>All In One Education</h1>
          </div>

          <div>
          <Link to="/admin/subjectList">Subject List</Link>
          <Link to="/admin/categoryList">Categories</Link>
          <Link to="/admin/levelList">Levels</Link>
          <Link to="/admin/tagList">Tags</Link>
          {/* <Link to="/admin/resourceCatalogue">Resource Catalogue</Link> */}
          <button className="link-button" onClick={() => logout()}>Logout</button>
        </div>

      </nav>
        <div>
        <Router>

          <SubjectList path="/admin/subjectList"/>
          <AddSubject path="/admin/subjectList/addSubject"/>
          <UpdateSubject path="/admin/subjectList/updateSubject"/>

          <CategoryList path="/admin/categoryList"/>
          <UpdateCategory path="/admin/categoryList/updateCategory"/>
          <DeleteCategory path="/admin/categoryList/deleteCategory"/>

          <LevelList path="/admin/levelList"/>
          <UpdateLevel path="/admin/levelList/updateLevel"/>
          <DeleteLevel path="/admin/levelList/deleteLevel"/>

          <TagList path="/admin/tagList"/>
          <UpdateTag path="/admin/tagList/updateTag"/>
          <DeleteTag path="/admin/tagList/deleteTag"/>

          {/* <ResourceCatalogue path="/admin/resourceCatalogue"/> */}

        </Router> 
        </div>
      </div>
    :
    <Layout>
    <SignInManager/>
    </Layout>
    }
      
    
  </div>
  )
}

export default AdminPage
