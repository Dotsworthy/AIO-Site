import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

function ResourceCatalogue() {
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
    // setSearchTerm("")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSearchTerm(searchLog);
    // setSearchLog("");
  }

  const getDownload = (download) => {
    const storage = firebase.storage();
    const storageRef = storage.ref()
    const httpsReference = storageRef.child(download);
  
    httpsReference.getDownloadURL().then(function(url) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
      let a = document.createElement('a');
          a.href = window.URL.createObjectURL(xhr.response);
          a.download = `${download}`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();   
      };
      xhr.open('GET', url);
      xhr.send();
    }).catch(function(error) {
      console.log(error);
    });
  }

  const getImageURL = (id, resource) => {
    const storageRef = firebase.storage().ref(`${resource.image}`)
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
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
  }
  },[categorySelected, levelSelected, tagSelected]);

  return (
    <div>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" value={searchLog} onChange={(e) => setSearchLog(e.target.value)}  placeholder="Search.." id="input" name="search"/>
                <button  type="submit">Submit</button>
        </form>
      </div>
      <div className="resource-page-container">
        <div>
          <div className="resource-page-filter">
              <h3>Categories</h3>
              <button className="button-active" onClick={() => setCategorySelected("")}>Show All</button>  
              {allCategories.map(category => (
                  <button style={ category.name === categorySelected ? {color: "red"} : {color: "black"}} key={category.id} className="button" 
                  onClick={() => setCategorySelected(category.name)}
                  >{category.name}</button>
              ))}
          </div>
          <div className="resource-page-filter">
              <h3>Education Level</h3>
              <button className="button-active" onClick={() => setLevelSelected("")}>Show All</button>    
              {allLevels.map(level => (
                  <button style={ level.name === levelSelected ? {color: "red"} : {color: "black"}} key={level.id} className="button" 
                  onClick={() => setLevelSelected(level.name)}
                  >{level.name}</button>
              ))}
          </div>
          <div className="resource-page-filter">
              <h3>Tags</h3>
              <button className="button-active" onClick={() => setTagSelected("")}>Show All</button>    
              {allTags.map(tag => (
                  <button style={ tag.name === tagSelected ? {color: "red"} : {color: "black"}} key={tag.id} className="button" 
                  onClick={() => setTagSelected(tag.name)}
                  >{tag.name}</button>
              ))}
          </div>
          <div className="resource-page-filter">
              <button onClick={() => clearFilters()}>Clear Filter</button>
          </div>
        </div>
      <div className="resource-page-items">
        {resources.length > 0  ? 
        resources.map(resource => (
        <div key={resource.id} className="catalogue-item">
            <h3>{resource.name}</h3>
            <div className="catalogue-image-container">
            <img className="catalogue-image" src={getImageURL(resource.id, resource)}  id={resource.id} alt={resource.name}></img>
            </div>
            <div className="catalogue-button">
            <button>More Info</button>
            <button onClick={() => getDownload(resource.download)}>Download</button>
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