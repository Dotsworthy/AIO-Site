import React, { useState, useEffect } from "react"
import DeleteResource from "./deleteResource"
import { Link } from "@reach/router"
import firebase from "./firebase"
import 'firebase/storage'

const ListSubjects = ({ editItem }) => {
  
  // used for rendering resources
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null)

  // used for deleting resources
  const [deleting, setDeleting] = useState(false)
  const [currentResource, setCurrentResource] = useState([])

  // renders the list of resources
  useEffect(() => {
    if (searchTerm) {
      const unsubscribe = firebase.firestore().collection("items").where("name", "==", searchTerm).onSnapshot(snapshot => {
        const listResources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setResources(listResources);
      });
      return unsubscribe
    } else {
      const unsubscribe = firebase.firestore().collection("items").orderBy("name").onSnapshot(snapshot => {
        const listResources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setResources(listResources);
      });
      return unsubscribe
    }
  }, [searchTerm])

  // sets Resource to be passed to deleteResource component
  const deleteResource = (item) => {
    setDeleting(true)
    setCurrentResource({
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
  
  const onSubmit = e => {
    e.preventDefault()
    const element = document.getElementById("search").value
    setSearchTerm(element);
  }

  return (
    <div>
    <nav className="database-navigation-container">
    <Link to="/admin/subjectList/addSubject">Add Subject</Link>
    <form onSubmit={onSubmit} className="nav-bar-form">
    <input type="text" id="search" name="search"/>
    <button type="submit">Search</button>
    <button type="reset" onClick={() => setSearchTerm(null)}>Clear</button>
    </form>
    </nav>  
    <table className="database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Resource Name</th>
          <th className="category">Category</th>
          <th className="level">Level</th>
          <th className="tags">Tags</th>
        </tr>
      </tbody>
      {resources.map(resource => (
            <tbody key={resource.id}>
              <tr className="data-row">
                <td className="resource-name">{resource.name}</td>
                <td className="category">{resource.category}</td>
                <td className="level">{resource.level}</td>
                <td className="tags">{resource.tags.toString()}</td>
                <td className="buttons">
                    <button onClick={() => editItem(resource)}>Edit</button>
                    <button onClick={() => deleteResource(resource)}>Delete</button>
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    {deleting && <DeleteResource
      setDeleting={setDeleting}
      currentResource={currentResource}
    />}

    </div>
  )
}

export default ListSubjects