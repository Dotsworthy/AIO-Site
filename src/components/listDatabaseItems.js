import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import UpdateDatabaseItem from "./updateDatabaseItem"
import DeleteDatabaseItem from "./deleteDatabaseItem"
import RenderResourceNumber from "./renderResourceNumber"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSort } from '@fortawesome/free-solid-svg-icons'

// TO DO: Implement similar search functionality from list Subjects

const ListDatabaseItems = ({ collection, resourceEntry }) => {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState(null)
  const [currentItem, setCurrentItem] = useState()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (searchTerm) {
      const unsubscribe = firebase.firestore().collection(`${collection}`).where("name", "==", searchTerm).onSnapshot(snapshot => {
        const listItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(listItems);
      });
      return unsubscribe
    } else {
      const unsubscribe = firebase.firestore().collection(`${collection}`).orderBy("name").onSnapshot(snapshot => {
        const listItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(listItems);
      });
      console.log(items);
      return unsubscribe
    }

  }, [editing, searchTerm])

  const editDatabaseItem = (item, collection, location) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      location: location,
      collection: collection
    })

    // navigate("/admin/categoryList/updateCategory")
    setEditing(true)
  }

  const deleteDatabaseItem = (item, collection, location) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      location: location,
      collection: collection
    })

    setDeleting(true)

    // navigate("/admin/categoryList/deleteCategory")
  }
  const onSubmit = e => {
    e.preventDefault()
    const element = document.getElementById("search").value
    setSearchTerm(element);
  }

  return (
    <div className="database-container">
      {!editing && !deleting &&
        <>
          <div className="database-navigation-container">
            <form onSubmit={onSubmit} className="database-navigation-content">
              <input className="search-bar-small" type="text" id="search" name="search" placeholder="Search" />
              <div className="database-navigation-footer-small">
                <button type="submit">Search</button>
                <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
              </div>
            </form>
          </div>


          <table className="database-table">
            <thead>
              <tr className="header-row">
                <th className="name">Name</th>
                <th className="resources">Resources Attached</th>
                <th className="buttons"></th>
              </tr>
            </thead>
            <tbody >
              {items.map(item => (

                <tr className="data-row" key={item.id}>
                  <td className="item-name">{item.name}</td>
                  <RenderResourceNumber currentItem={item} resourceEntry={resourceEntry} />
                  <td className="table-buttons">
                    <button onClick={() => editDatabaseItem(item, collection, resourceEntry)}>Edit</button>
                    <button onClick={() => deleteDatabaseItem(item, collection, resourceEntry)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>

      }



      {editing && <UpdateDatabaseItem setEditing={setEditing} currentItem={currentItem} />}
      {deleting && <DeleteDatabaseItem setDeleting={setDeleting} currentItem={currentItem} />}
    </div>
  )
}

export default ListDatabaseItems