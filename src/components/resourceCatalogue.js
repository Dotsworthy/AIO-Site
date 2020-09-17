import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'



function ResourceCatalogue() {
  const [resources, setResources] = useState([]);
  const [allCategories, setAllCategories] = useState([])
  const [category, setCategory] = useState("") 

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

const getDownload = () => {
  const storage = firebase.storage();
  const storageRef = storage.ref()
  const httpsReference = storageRef.child('downloads/Barack-Obama.jpg');
  
  httpsReference.getDownloadURL().then(function(url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
    var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send(new Blob);
    console.log(xhr);
  }).catch(function(error) {
    console.log(error);
  });
}

const categories = CategoriesList();

useEffect(() => {
  if(category) {
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

},[category]);

return (
  <div>
  <div className="resource-page-search">
          <h3>Categories</h3>
          <div className="resource-page-categories">
          <button className="button-active" onClick={() => setCategory("")}>Show All</button>    
          {allCategories.map(category => (
              <button className="button" 
              onClick={() => setCategory(category.name)}
              >{category.name}</button>
          ))}
          </div>
      </div>
  <div className ="resource-page-items">
      {resources.map(resource => (
        <div className="catalogue-item">
            <h3>{resource.name}</h3>
            <div className="catalogue-image-container">
            <img className="catalogue-image" src={resource.image}></img>
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