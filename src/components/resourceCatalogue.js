import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

function ResourceCatalogue() {
  const [resources, setResources] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [categorySelected, setCategorySelected] = useState("") ;
  const [levelSelected, setLevelSelected] = useState("");

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

  useEffect(() => {
    if (categorySelected && levelSelected) {
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
  } else if (categorySelected && !levelSelected) {
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
  } else if (!categorySelected && levelSelected) {
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
  },[categorySelected, levelSelected]);

  return (
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
            <button onClick={() => clearFilters()}>Clear Filter</button>
        </div>
      </div>
    <div className ="resource-page-items">
        {resources.map(resource => (
          <div key={resource.id} className="catalogue-item">
              <h3>{resource.name}</h3>
              <div className="catalogue-image-container">
              <img className="catalogue-image" src={resource.image} alt={resource.name}></img>
              </div>
              <div className="catalogue-button">
              <button>More Info</button>
              <button onClick={() => getDownload(resource.download)}>Download</button>
              </div>
          </div>      
        ))}
      </div>
    </div>
  )
}

export default ResourceCatalogue