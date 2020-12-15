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
  const [searchTerm, setSearchTerm] = useState();
  // const [page, setPage] = useState(0)

  useEffect(() => {
    let listTags
    firebase
    .firestore()
    .collection("tags")
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
    .onSnapshot(snapshot => {
      listLevels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
      setAllLevels(listLevels)
    })
  },[])

  const clearFilters = () => {
    setLevelSelected("")
    setCategorySelected("")
    setTagSelected("")
    setSearchTerm("")
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
    if (searchTerm) {
        const unsubscribe = firebase.firestore().collection("subjects").orderBy("name").onSnapshot(snapshot => {
          const listResources = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          let result = listResources
          .filter(resource =>  
               resource.name.toLowerCase().includes(searchTerm.toLowerCase()) 
            || resource.category.toLowerCase().includes(searchTerm.toLowerCase()) 
            || resource.level.toLowerCase().includes(searchTerm.toLowerCase())
            || resource.tags.some(tag => 
              tag.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )
          if (categorySelected) {
            const category = result.filter(resource => resource.category == categorySelected)
            result = category;
          }
          if (levelSelected) {
            const level = result.filter(resource => resource.level == levelSelected)
            result = level;
          }  
          if (tagSelected) {
            const tag = result.filter(resource => 
            resource.tags.some(tag => tag.includes(tagSelected)))
            result = tag;
          }
          setResources(result);
          })
        return unsubscribe
    } else {
      const unsubscribe = firebase.firestore().collection("subjects").orderBy("name").onSnapshot(snapshot => {
        const listResources = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        let result = listResources
        if (categorySelected) {
          const category = result.filter(resource => resource.category == categorySelected)
          result = category;
        }
        if (levelSelected) {
          const level = result.filter(resource => resource.level == levelSelected)
          result = level;
        }  
        if (tagSelected) {
          const tag = result.filter(resource => 
          resource.tags.some(tag => tag.includes(tagSelected)))
          result = tag;
        }
        setResources(result);
      });
      return unsubscribe
    }
  }, [searchTerm, categorySelected, levelSelected, tagSelected])

  const onSubmit = e => {
    e.preventDefault()
    const element = document.getElementById("search").value
    setSearchTerm(element);
  }

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
          <form className="resource-page-form" onSubmit={onSubmit}>
                <input type="text" id="search"  placeholder="Search" name="search"/>

                <div className="form-footer">
                <button type="submit">Search</button>
                <button type="reset" onClick={() => clearFilters()}>Clear</button>
                </div>
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