import React, { useState } from "react"
import firebase from "../components/firebase"
import ListSubjects from "../components/ListSubjects"
import UpdateItem from "../components/updateitem"
// import AddItemForm from "../components/addItemForm"
import DeleteItem from "../components/deleteItem"
import Layout from "../components/layout"
import { navigate } from "gatsby"
import { Router, Link } from "@reach/router"
import AddSubject from "./addSubject"
import UpdateSubject from "./updateSubject"
// import SubjectList from "./subjectList"

const AdminPage = () => {

  const SubjectList = () => <ListSubjects deleteItem={deleteItem}></ListSubjects>

  // let AddSubject = () => <div>Add Subject</div>
  // let ManageCategories = () => <div>Manage Categories</div>
  // let ManageEducationLevels = () => <div>Manage Educational Level</div>
  // let ManageTags = () => <div>Manage Tags</div>
  // let UpdateSubject = () => <div>Update Item</div>

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

  // const updateItem = ({ currentItem }, updatedItem) => {
  //   console.log(
  //     "It sends the item to the updated item function:",
  //     updatedItem,
  //     currentItem.id
  //   );
  //   //When the Update button is pressed, it turns off editing
  //   setEditing(false)
  //   firebase
  //     .firestore()
  //     .collection("items")
  //     .doc(currentItem.id)
  //     .update(updatedItem);

  //   };

  // const handleAddResourceClick = () => {
  //   navigate("/addSubject")
  // }

  return (

  <Layout>
    <Router>
        <SubjectList path="subjectList">
          <AddSubject path="addSubject"/>
          <UpdateSubject path="updateSubject/:subjectId"/>
        </SubjectList>
    </Router>

    <Link to="/subjectList">Subject List</Link>


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
