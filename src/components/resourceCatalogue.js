import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import 'firebase/storage'
// import { Router, Link } from "@reach/router";
import MoreInfo from "./MoreInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import DownloadHandler from "../components/downloadHandler";

// TODO: fire an event when a mobile filter is closed to reset the search field.
// TODO: custom routes for more info?

const ResourceCatalogue = ( ) => {
  const [resources, setResources] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [categorySelected, setCategorySelected] = useState("") ;
  const [levelSelected, setLevelSelected] = useState("");
  const [tagSelected, setTagSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState();
  const [currentItem, setCurrentItem] = useState([])
  const [moreInfo, setMoreInfo] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  const getMoreInfo = (item) => {
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

    setMoreInfo(true)
  }

  const downloadResource = item => {
    setDownloading(true);
    setCurrentItem({
        id: item.id,
        name: item.name,
        download: item.download
    })
}

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
            const category = result.filter(resource => resource.category === categorySelected)
            result = category;
          }
          if (levelSelected) {
            const level = result.filter(resource => resource.level === levelSelected)
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
          const category = result.filter(resource => resource.category === categorySelected)
          result = category;
        }
        if (levelSelected) {
          const level = result.filter(resource => resource.level === levelSelected)
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

  const expandMenu = (item) => {
    const column = document.getElementsByClassName("content");
    const selectedColumn = document.getElementById(item);

    if (selectedColumn.style.display === "flex") {
      selectedColumn.style.display = "none";
      // selectedFilter.value = "";
    } else {
      column[0].style.display = "none";
      column[1].style.display = "none";
      column[2].style.display = "none";
      selectedColumn.style.display = "flex";
    }
  }

  const filterButtons = (item) => {
    const searchTerm = document.getElementById(`search-filter ${item}`).value;
    const list = document.getElementsByClassName(item)
    console.log(searchTerm);
    console.log(list);
    let i, a;

    for (i = 0; i < list.length; i++) {
      a = list[i]
      console.log(a.innerHTML);
      if (a.innerHTML.toLowerCase().includes(searchTerm.toLowerCase())) {
        a.style.display = "";
      } else {
        a.style.display = "none";
      }
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    const element = document.getElementById("search").value
    setSearchTerm(element);
  }

  return (
    <div className="resource-page">
      { !moreInfo && !downloading &&
      <>
        <form className="resource-page-search" onSubmit={onSubmit}>
          <input type="text" id="search"  placeholder="Search names, tags, etc..." name="search"/>

          {/* <div> */}
          <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch}/>
          </button>
          {/* </div> */}
        </form>
      
        <div className="resource-page-container">
 
          <div className="resource-page-filter-bar">

            <div className="resource-page-button-menu">
            <button onClick={() => clearFilters()}>Clear Filter</button>
              <button type="button" class="collapsible" onClick={() => expandMenu("categories")}>Categories</button>
              <button type="button" class="collapsible" onClick={() => expandMenu("levels")}>Level</button>
              <button type="button" class="collapsible"  onClick={() => expandMenu("tags")}>Tags</button>
            
            
            
            
            
            
            
            </div>

            <div className="resource-page-filter-box">
              <div className="content"  id="categories"> 

              <div className="content-search">
                <form><input type="text" id="search-filter categories" onChange={() => filterButtons("categories")} placeholder="search categories"/></form>
              </div>


              <div className="content-filters">
                {allCategories.map(category => (
                        <button style={ category.name === categorySelected ? {color: "red"} : {color: "black"}} key={category.id} id="filter-button" className="filter-button categories"   
                        onClick={() => setCategorySelected(category.name)}
                        >{category.name}</button>
                    ))}
              </div>
            </div>
          
            <div className="content"  id="levels">

            <div className="content-search">
                <form><input type="text" id="search-filter levels" onChange={() => filterButtons("levels")} placeholder="search levels"/></form>
              </div>      

            <div className="content-filters">     
              {allLevels.map(level => (
                      <button style={ level.name === levelSelected ? {color: "red"} : {color: "black"}} key={level.id} className="filter-button levels" 
                      onClick={() => setLevelSelected(level.name)}
                      >{level.name}</button>
                  ))}
            </div> 
            </div>

            <div className="content"  id="tags">

            <div className="content-search">
                <form><input type="text" id="search-filter tags" onChange={() => filterButtons("tags")} placeholder="search levels"/></form>
              </div>        

                <div className="content-filters">
              {allTags.map(tag => (
                      <button style={ tag.name === tagSelected ? {color: "red"} : {color: "black"}} key={tag.id} className="filter-button tags" 
                      onClick={() => setTagSelected(tag.name)}
                      >{tag.name}</button>
                  ))}
                </div>
              </div>
          </div>
        </div>

        <div className="resource-page-filters">
        <button onClick={() => clearFilters()}>Clear Filter</button>
        <div className="resource-page-filter">
            <div className="catalogue-item-header">
              <h3>Categories</h3>
            </div>
            <div className="content-search">
                <form><input type="text" id="search-filter categories1" onChange={() => filterButtons("categories1")} placeholder="search categories"/></form>
              </div>
              <div 
              className="form-inside-content"
              >
              
              {/* <button className="filter-button" onClick={() => setCategorySelected("")}>Show All</button>   */}
              
              
              {allCategories.map(category => (
                  <button style={ category.name === categorySelected ? {color: "red"} : {color: "black"}} key={category.id} className="filter-button categories1" 
                  onClick={() => setCategorySelected(category.name)}
                  >{category.name}</button>
              ))}
              
              
              </div>         
              </div>
          <div className="resource-page-filter">
            <div className="catalogue-item-header">
              <h3>Education Level</h3>
              </div>
              <div className="content-search">
                <form><input type="text" id="search-filter levels1" onChange={() => filterButtons("levels1")} placeholder="search levels"/></form>
              </div>
              <div 
              className="form-inside-content"
              >
              
              {/* <button className="filter-button" onClick={() => setLevelSelected("")}>Show All</button>     */}
              {allLevels.map(level => (
                  <button style={ level.name === levelSelected ? {color: "red"} : {color: "black"}} key={level.id} className="filter-button levels1" 
                  onClick={() => setLevelSelected(level.name)}
                  >{level.name}</button>
              ))}
              </div>
          </div>
          <div className = "resource-page-filter">
            <div className = "catalogue-item-header">
              <h3>Tags</h3>
              </div>
              <div className="content-search">
                <form><input type="text" id="search-filter tags1" onChange={() => filterButtons("tags1")} placeholder="search tags"/></form>
              </div>
              <div
               className="form-inside-content"
              >
              
              {/* <button className="filter-button" onClick={() => setTagSelected("")}>Show All</button>     */}
              {allTags.map(tag => (
                  <button style={ tag.name === tagSelected ? {color: "red"} : {color: "black"}} key={tag.id} className="filter-button tags1" 
                  onClick={() => setTagSelected(tag.name)}
                  >{tag.name}</button>
              ))}
              </div>
          </div>

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
              <button onClick={() =>  getMoreInfo(resource)}>More Info</button>
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
    </>
    }

    {moreInfo && 
      <div className="additional-container">
        <MoreInfo currentItem={currentItem} setDownloading={setDownloading} setMoreInfo={setMoreInfo}/>
      </div>
    
    }
    {downloading && 
    <div className="additional-container">
      <div className="catalogue-download" id="white">
      <div className="more-info-item-header">
                    <h2>Downloads</h2>
                    <button className="mobile-button" onClick={() => setDownloading(false)}>X</button>
                </div>   
      <DownloadHandler currentItem={currentItem} setMoreInfo={setMoreInfo} setDownloading={setDownloading}/>
    </div>


    </div>
    
    
    
    }
    </div>
  )
}

export default ResourceCatalogue