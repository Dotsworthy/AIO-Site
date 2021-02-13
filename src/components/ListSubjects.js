import React, { useState, useEffect } from "react"
import DeleteSubject from "./deleteSubject"
import UpdateSubject from "./updateSubject"
import { navigate } from "gatsby"
import firebase from "./firebase"
// import 'firebase/storage'

// can't search by tags

const ListSubjects = () => {
  
  // used for rendering and filtering resources
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null)
  const [orderBy, setOrderBy] = useState("name")

  // used for deleting resources
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState([])
 
  // renders the list of resources
  useEffect(() => {
    if (searchTerm) {
        const unsubscribe = firebase.firestore().collection("subjects").orderBy(orderBy).onSnapshot(snapshot => {
          const listResources = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log(listResources);
          const result = listResources
          .filter(resource =>  
               resource.name.toLowerCase().includes(searchTerm.toLowerCase()) 
            || resource.category.toLowerCase().includes(searchTerm.toLowerCase()) 
            || resource.level.toLowerCase().includes(searchTerm.toLowerCase())
            || resource.tags.some(tag => 
              tag.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )      
          setResources(result);
          })
        return unsubscribe
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
  }

  const addSubject = e => {
    e.preventDefault()
    navigate("/admin/subjectList/addSubject")
  }

  return (
    
    <div className="database-container">
      
      {!editing && <> 
        <div className="database-navigation-container">
          <button className="add-subject-button" onClick={((e) => addSubject(e))}>Add Subject</button>
        
          <form className="database-navigation-content" onSubmit={onSubmit}>
            <input className="search-bar" type="text" id="search" placeholder="Search" name="search"/>
            <div className="database-navigation-footer">
              <button type="submit">Search</button>
              <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
            </div>   

          </form>
        </div>  

      <table className="database-table">



        <thead>
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
              <button onClick={() => setOrderBy("tags")} >
              Tags
              </button>
            </th>

            <th className="buttons">

            </th>
          </tr>
        </thead>
        <tbody>
        {resources.length > 0 ? resources.map(resource => (
            <tr className="data-row" key={resource.id}>
              <td className="resource-name">{resource.name}</td>
              <td className="category">{resource.category}</td>
              <td className="level">{resource.level}</td>
              <td className="tags">{resource.tags.join(', ')}</td>
              <td className="table-buttons">
                <button onClick={() => editSubject(resource)}>Edit</button>
                <button onClick={() => deleteSubject(resource)}>Delete</button>
              </td>
            </tr>

        ))
        :
        <p>No Results</p>
        }
      </tbody>
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