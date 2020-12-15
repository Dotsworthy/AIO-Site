import React, { useState, useEffect } from "react"
import DeleteSubject from "./deleteSubject"
import UpdateSubject from "./updateSubject"
import { Link } from "@reach/router"
import { navigate } from "gatsby"
import firebase from "./firebase"
// import 'firebase/storage'

const ListSubjects = () => {
  
  // used for rendering and filtering resources
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null)
  const [searchLocation, setSearchLocation] = useState()
  const [orderBy, setOrderBy] = useState("name")

  // used for deleting resources
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState([])

  // renders the list of resources
  useEffect(() => {
    if (searchTerm) {
      if (searchLocation == "tags") {
        const unsubscribe = firebase.firestore().collection("subjects").onSnapshot(snapshot => {
          const listResources = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setResources(listResources);
        });
        return unsubscribe
      } else {
        const unsubscribe = firebase.firestore().collection("subjects").onSnapshot(snapshot => {
          const listResources = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          // setResources(listResources);
          // let result = []
          const result = listResources.filter(resource => { return resource.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1});
          setResources(result);
          })
          // listResources.filter(resource => {
          //   console.log(resource);
          //   resource.name.toLowerCase().indexOf(searchTerm.toLowerCase() >= 0);
          //   console.log(result);
          // setResources(result) ; 
          // })
        // });
        return unsubscribe
      }
    } else {
      const unsubscribe = firebase.firestore().collection("subjects").orderBy(orderBy).onSnapshot(snapshot => {
        const listResources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setResources(listResources);
      });
      return unsubscribe
    }
  }, [editing, searchTerm, orderBy])

  // sets Resource to be passed to deleteResource component
  const deleteSubject = (item) => {
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

  const editSubject = (item) => {
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

    setEditing(true)
  }
  
  // search form
  const onSubmit = e => {
    e.preventDefault()
    const element = document.getElementById("search").value
    setSearchTerm(element);
    const category = document.getElementById("location").value
    setSearchLocation(category)
  }

  const addSubject = e => {
    e.preventDefault()
    navigate("/admin/subjectList/addSubject")
  }



  return (
    
    <div className="database-container">
      
      {!editing && <> 
        <div className="database-navigation-container">
        <button onClick={((e) => addSubject(e))}>Add Subject</button>
        <form className="database-navigation-content" onSubmit={onSubmit}>
          <input type="text" id="search" name="search" placeholder="Search"/>
          <select id="location" name="location">
            <option value="name">Resource Name</option>
            <option value="category">Category</option>
            <option value="level">Level</option>
            <option value="tags">Tags</option>
          </select>
        
        <div className="form-footer">
        <button type="submit">Search</button>
        <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
        </div>   

        </form>
      </div>  
    
      <table className="database-table">
        <tbody>
          <tr className="header-row">
            <th className="name">
              <button onClick={() => setOrderBy("name")}>Resource Name</button>
            </th>
            
            <th className="category">
              <button onClick={() => setOrderBy("category")}>Category</button>
            </th>
            
            <th className="level">
              <button onClick={() => setOrderBy("level")}>Level</button>
            </th>
            
            <th className="tags">
              <button onClick={() => setOrderBy("tags")}>Tags</button>
            </th>
          </tr>
        </tbody>
        {resources.length > 0 ? resources.map(resource => (
          <tbody key={resource.id}>
            <tr className="data-row">
              <td className="resource-name">{resource.name}</td>
              <td className="category">{resource.category}</td>
              <td className="level">{resource.level}</td>
              <td className="tags">{resource.tags.toString()}</td>
              <td className="table-buttons">
                <button onClick={() => editSubject(resource)}>Edit</button>
                <button onClick={() => deleteSubject(resource)}>Delete</button>
              </td>
            </tr>
          </tbody>
        ))
        :
        <p>No Results</p>
        }
      </table>
        
        
        </>}
      

      {deleting && <div className="popup-container"><DeleteSubject
        setDeleting={setDeleting}
        currentItem={currentItem}
        />
        </div>
      }

      {editing && <UpdateSubject
      currentItem={currentItem}
      setEditing={setEditing}
      />}

  </div>
  )
}

export default ListSubjects