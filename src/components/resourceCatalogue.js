import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

const ResourceCatalogue = ( { downloadResource }) => {
  const [resources, setResources] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [categorySelected, setCategorySelected] = useState("") ;
  const [levelSelected, setLevelSelected] = useState("");
  const [tagSelected, setTagSelected] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchLog, setSearchLog] = useState("")
  // const [page, setPage] = useState(0)

  useEffect(() => {
    let listTags
    firebase
    .firestore()
    .collection("tags")
    .orderBy("name")
    .onSnapshot(snapshot => {
      listTags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
      setAllTags(listTags)
    })
  },[])

  useEffect(() => {
    let listCategories
    firebase
    .firestore()
    .collection("categories")
    .orderBy("name")
    .onSnapshot(snapshot => {
      listCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
      setAllCategories(listCategories)
    })
  },[])

  useEffect(() => {
    let listLevels
    firebase
    .firestore()
    .collection("levels")
    .orderBy("name")
    .onSnapshot(snapshot => {
      listLevels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
      setAllLevels(listLevels)
    })
  },[])

  const clearFilters = (e) => {
    e.preventDefault()
    setLevelSelected("")
    setCategorySelected("")
    setTagSelected("")
    // setSearchTerm("")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSearchTerm(searchLog);
    // setSearchLog("");
  }

  const getImageURL = (id, location, resource) => {
    const storageRef = firebase.storage().ref(`${location}/${id}/${resource.image}`)
    storageRef.getDownloadURL().then(function(url) {

      const img = document.getElementById(id)
      img.src = url;
    }).catch(function(error) {
    })
  }

  useEffect(() => {
    if (categorySelected && levelSelected && tagSelected) {
      firebase
      .firestore()
      .collection("items")
      .where("category", "==", categorySelected)
      .where("level", "==", levelSelected)
      .where("tags", "array-contains", tagSelected)
      .orderBy("name")
      .onSnapshot(snapshot => {
        const listResources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResources(listResources);
      })
  } else if (categorySelected && levelSelected && !tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .where("category", "==", categorySelected)
    .where("level", "==", levelSelected)
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else if (categorySelected && !levelSelected && tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .where("category", "==", categorySelected)
    .where("tags", "array-contains", tagSelected)
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else if (categorySelected && !levelSelected && !tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .orderBy("name")
    .where("category", "==", categorySelected)
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else if (!categorySelected && levelSelected && tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .where("level", "==", levelSelected)
    .where("tags", "array-contains", tagSelected)
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else if (!categorySelected && levelSelected && !tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .where("level", "==", levelSelected)
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else if (!categorySelected && !levelSelected && tagSelected) {
    firebase
    .firestore()
    .collection("items")
    .where("tags", "array-contains", tagSelected)
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  } else {
    firebase
    .firestore()
    .collection("items")
    .orderBy("name")
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
      // const categories = [];
      // listResources.forEach(resource => {
      //   if (categories.includes(resource.category)) {
      //     return;
      //   } else {
      //     categories.push(resource.category)
      //   }
      // })
      // console.log(categories);
      // setAllCategories(categories);
    })
  }
  },[categorySelected, levelSelected, tagSelected]);

  // const getList = () => {

  // }

  return (
    <div>
      <div className="resource-page-container">
        <div className="resource-page-filters">
          <div className="resource-page-filter">
            <div className="catalogue-item-header">
              <h3>Categories</h3>
            </div>
              <div className="form-inside-content">
              <button className="filter-button" onClick={() => setCategorySelected("")}>Show All</button>  
              {allCategories.map(category => (
                  <button style={ category.name === categorySelected ? {color: "red"} : {color: "black"}} key={category.id} className="filter-button" 
                  onClick={() => setCategorySelected(category.name)}
                  >{category.name}</button>
              ))}
              </div>         
              </div>
          <div className="resource-page-filter">
            <div className="catalogue-item-header">
              <h3>Education Level</h3>
              </div>
              <div className="form-inside-content">
              <button className="filter-button" onClick={() => setLevelSelected("")}>Show All</button>    
              {allLevels.map(level => (
                  <button style={ level.name === levelSelected ? {color: "red"} : {color: "black"}} key={level.id} className="filter-button" 
                  onClick={() => setLevelSelected(level.name)}
                  >{level.name}</button>
              ))}
              </div>
          </div>
          <div className = "resource-page-filter">
            <div className = "catalogue-item-header">
              <h3>Tags</h3>
              </div>
              <div className="form-inside-content">
              <button className="filter-button" onClick={() => setTagSelected("")}>Show All</button>    
              {allTags.map(tag => (
                  <button style={ tag.name === tagSelected ? {color: "red"} : {color: "black"}} key={tag.id} className="filter-button" 
                  onClick={() => setTagSelected(tag.name)}
                  >{tag.name}</button>
              ))}
              </div>
          </div>
          <form className="resource-page-form" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" value={searchLog} onChange={(e) => setSearchLog(e.target.value)}  placeholder="Search.." id="input" name="search"/>
                <button  type="submit">Search</button>
                <button onClick={(e) => clearFilters(e)}>Clear Filter</button>
        </form>
        
          
        </div>
      <div className="resource-page-items">
        {resources.length > 0  ? 
        resources.map(resource => (
        <div key={resource.id} className="catalogue-item">
            <div className="catalogue-item-header">
              <h3>{resource.name}</h3>
            </div>
            
                        <div className="catalogue-image-container">
            <img className="catalogue-image" src={getImageURL(resource.id, "images", resource)}  id={resource.id} alt={resource.name}></img>
            </div>
            <div className="catalogue-button">
            <button>More Info</button>
            <button onClick={() => downloadResource(resource)}>Download</button>
            </div>
        </div>      
        ))
          :
          <div>
            <p>Sorry no results. Please try a different level or category, or press cancel filter to try a new search</p>
          </div>
        }
        </div>
    </div>
    </div>
  )
}

export default ResourceCatalogue