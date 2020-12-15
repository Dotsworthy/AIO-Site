import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import UpdateDatabaseItem from "./updateDatabaseItem"
import DeleteDatabaseItem from "./deleteDatabaseItem"

// const db = firebase.firestore()

const ListDatabaseItems = ( { collection, resourceEntry} ) => {
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
        return unsubscribe
      }
        
      }, [editing, searchTerm])

    // The functions below were used to render the number of resources attached. Currently non-working.

    // const resources = []
    
    // const addResourcesAttached = async (item) => {
    //   const resources = []
    //   const resourcesRef = db.collection("items")
    //   await resourcesRef.where(`${resourceEntry}`, "==", `${item}`).get().then(function(querySnapshot) {
    //     if (querySnapshot.empty) {
    //       return
    //   } else {
    //       querySnapshot.forEach(doc => {
    //       resources.push({...doc.data()})
    //       })}
    //   }
    //   ).catch(function(error) {
    //     console.log("Error getting documents: ", error)
    //   });
    //   return resources
    // }
  
    // const getResourcesAttached = async (category) => {
    //   const result = await
    //   addResourcesAttached(category).then(value => {
    //     return value
    //   })
    //   const resourcesAttached = result.length
    //   return resources.push({category, resourcesAttached})
    // }  

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
      <div className="database-navigation-container">

          <form onSubmit={onSubmit} className="nav-bar-form">
          <input type="text" id="search" name="search" placeholder="Search"/>
          <div className="form-footer">
          <button type="submit">Search</button>
          <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
          </div>
          </form>
      </div>


        <table className="database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Name</th>
        </tr>
      </tbody>
      {items.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="item-name">{item.name}</td>
                <td className="buttons">
                    <button onClick={() => editDatabaseItem(item, collection, resourceEntry)}>Edit</button>
                    <button onClick={() => deleteDatabaseItem(item, collection, resourceEntry)}>Delete</button>
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    {editing && <UpdateDatabaseItem setEditing={setEditing} currentItem={currentItem}/>}
    {deleting && <DeleteDatabaseItem setDeleting={setDeleting} currentItem={currentItem}/>}    
    </div>
    )
}

export default ListDatabaseItems