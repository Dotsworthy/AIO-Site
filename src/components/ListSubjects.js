import React, { useState, useEffect } from "react"
import DeleteItem from "./deleteItem"
import { Router, Link } from "@reach/router"
import firebase from "./firebase"
import 'firebase/storage'

const ListSubjects = () => {
  const [resources, setResources] = useState([]);
  const [deleting, setDeleting] = useState(false)
  const [currentItem, setCurrentItem] = useState([])

  useEffect(() => {
    firebase
    .firestore()
    .collection("items")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setResources(listResources);
    })
  }, [])

  const deleteItem = (item) => {
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
  
  return (
    <div>
    <Link to="/admin/subjectList/addSubject">Add Subject</Link>

    <table className="resource-database-table">
      <tbody>
        <tr className="header-row">
          <th className="name">Resource Name</th>
          <th className="category">Category</th>
          <th className="level">Level</th>
          <th className="tags">Tags</th>
        </tr>
      </tbody>
      {resources.map(item => (
            <tbody key={item.id}>
              <tr className="data-row">
                <td className="resource-name">{item.name}</td>
                <td className="category">{item.category}</td>
                <td className="level">{item.level}</td>
                <td className="tags">{item.tags.toString()}</td>
                <td className="buttons">
                    <Link to={`updateSubject/${item.id}`}>Edit</Link>
                    <button onClick={() => deleteItem(item)}>Delete</button>
                    
                    
                </td>
              </tr>
            </tbody>
          ))}
    </table>

    {deleting && <DeleteItem
      setDeleting={setDeleting}
      currentItem={currentItem}
    />}

    </div>
  )
}

export default ListSubjects