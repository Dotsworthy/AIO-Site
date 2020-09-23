import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'

function ResourceCatalogue() {
  const [resources, setResources] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [category, setCategory] = useState("") ;
  const [level, setLevel] = useState("");

  const CategoriesList = () => {
    firebase
    .firestore()
    .collection("categories")
    .onSnapshot(snapshot => {
      const listCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    setAllCategories(listCategories)
  })
}

const LevelsList = () => {
  firebase
  .firestore()
  .collection("levels")
  .onSnapshot(snapshot => {
    const listLevels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
  }))
  setAllLevels(listLevels)
})
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
  if (category && level) {
    firebase
    .firestore()
    .collection("items")
    .where("category", "==", category)
    .where("level", "==", level)
    .onSnapshot(snapshot => {
      const listResources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(listResources);
    })
}

if (category && !level) {
  firebase
  .firestore()
  .collection("items")
  .where("category", "==", category)
  .onSnapshot(snapshot => {
    const listResources = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setResources(listResources);
  })
}

if (level && !category) {
  firebase
  .firestore()
  .collection("items")
  .where("category", "==", level)
  .onSnapshot(snapshot => {
    const listResources = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setResources(listResources);
  })
}

if (!level && !category) {
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

},[category],[level]);

return (
  <div className="resource-page-container">
    <div>
      <div className="resource-page-filter">
          <h3>Categories</h3>
          <button className="button-active" onClick={() => setCategory("")}>Show All</button>  
          {CategoriesList()}  
          {allCategories.map(category => (
              <button key={category.id} className="button" 
              onClick={() => setCategory(category.name)}
              >{category.name}</button>
          ))}
      </div>
      <div className="resource-page-filter">
          <h3>Education Level</h3>
          <button className="button-active" onClick={() => setLevel("")}>Show All</button>  
          {LevelsList()}  
          {allLevels.map(level => (
              <button key={level.id} className="button" 
              onClick={() => setLevel(level.name)}
              >{level.name}</button>
          ))}
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