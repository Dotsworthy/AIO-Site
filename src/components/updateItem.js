import React, { useState, useEffect } from "react";
import { navigate } from "gatsby"

import firebase from "firebase"
import 'firebase/storage'

const UpdateItem = ({ currentItem }) => {

  // item information to update the database
  const [item, setItem] = useState(currentItem);
  const database = firebase.firestore()
    
  // states for changed data that needs processing
  const [filesToUpload] = useState([])
  const [filesToDelete] = useState([])
  const [tag, setTag] = useState("");

  // warnings for duplicate entries and maximum entries
  const [warning, setWarning] = useState(false)
  const [nameWarning, setNameWarning] = useState(false);
  const [tagWarning, setTagWarning] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateFileWarning, setDuplicateFileWarning] = useState(false);
  
  const [duplicateFiles, setDuplicateFiles] = useState([])
  
  // original variables for checking whether to upload/download
  const originalImage = currentItem.image;
  const originalName = currentItem.name;

  const useItems = (location) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
      firebase
        .firestore()
        .collection(location)
        .onSnapshot(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setItems(listItems);
        });
        //called the unsubscribe--closing connection to Firestore.
        // return () => unsubscribe()
    }, [location]);
    return items;
  };
  
  const allCategories = useItems("categories");
  const allLevels = useItems("levels");
  const allTags = useItems("tags");

  const databaseCheck = async (name, location) => {
    let query = []
    const snapshot = await database
    .collection(location)
    .where("name", "==", name)
    .get()
    
    snapshot.forEach((doc) => query.push(doc))
    return query
  }

  const addDatabaseField = (name, location) => {
    firebase
    .firestore()
    .collection(location)
    .add({
      name
    })
  }

  // submission form
  const onSubmit = async e => {
    e.preventDefault();
    if (item.name && item.description && item.category && item.level && item.tags.length > 0 && item.image && item.download.length > 0) {
      const nameCheck = await databaseCheck(item.name, "items")
      const categoryCheck = await databaseCheck(item.category, "categories")
      const levelCheck = await databaseCheck(item.level, "levels")

      // console.log(originalName);
      console.log(item.name);
      console.log(nameCheck.length);
      
      if (originalName !== item.name && nameCheck.length > 0) {
        setNameWarning(true);
      } else {
          if (categoryCheck.length === 0) {
            addDatabaseField(item.category, "categories")
          }
    
          if (levelCheck.length === 0) {
            addDatabaseField(item.level, "levels")
          }

          item.tags.forEach(async tag => {
            const tagCheck = await databaseCheck(tag, "tags")
            if (tagCheck.length === 0) {
              addDatabaseField(tag, "tags")
            }
          })
        
        
        if (originalImage !== item.image) {
          deleteFile(originalImage, item.id, `images`)
          uploadFile('image', item.id, 'images')
        }
  
        filesToDelete.forEach(file => {
          if (item.download.includes(file) === true) {
            return
          } else {
            deleteFile(file, item.id, "downloads")
          }
        })
  
        uploadMultipleFiles(filesToUpload, item.id, "downloads")
  
        firebase
        .firestore()
        .collection("items")
        .doc(item.id)
        .update(item)

        navigate("/admin/subjectList")
      }
    } else {
      setWarning(true)
    }   
  };

  // changing item state
  const onChange = e => {
    const { name, value } = e.target
    setItem({ ...item, [name]: value })
  }

  const changeTags = (tags) => {
    const name = "tags";
    const value = tags;
    setItem({...item, [name]: value})
  }

  const changeImage = (file, location) => {
    const name = file;
    const value = location;
    setItem({...item, [name]: value})
  }

  const changeDownloads = (field, entry) => {
    const name = field
    const value = entry.map(file => {
      return `${file}`
    })
    
    setItem({...item, [name]: value})
  }

  // changing tags
  const addTag = (e, tag) => {
    e.preventDefault()
    setTagWarning(false)
    setDuplicateWarning(false)
    if (tag === "") {
      return
    } else if (item.tags.includes(tag)) {
      setDuplicateWarning(true);
    } else if (item.tags.length === 4) {
      setTagWarning(true);
    } else {
      const newTags = item.tags
      newTags.push(tag)
      changeTags(newTags)
      setTag("");
    } 
  }

  const deleteTag = (e, index) => {
    e.preventDefault()
    const newTags = item.tags
    newTags.splice(index, 1)
    changeTags(newTags)
    setTagWarning(false);
  }

  // changing downloads
  const removeFile = (e, file, index) => {
    e.preventDefault()
    setDuplicateFiles([])
    setDuplicateFileWarning(false);
    const newFiles = item.download
    newFiles.splice(index, 1)
    filesToDelete.push(file)
    changeDownloads("download", newFiles)
  }

  const uploadFile = (file, id, location) => {
    const selectedFile = document.getElementById(file).files[0];
    console.log(selectedFile);
    const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
    storageRef.put(selectedFile)
  }

  const uploadMultipleFiles = (file, id, location) => {
    const selectedFiles = file;
    const fileList = Array.from(selectedFiles);
    const databaseEntry = fileList.map(file => {
      return `${file.name}`
    });
    fileList.forEach(file => {
      const storageRef = firebase.storage().ref(`${location}/${id}/${file.name}`)
      storageRef.put(file)
    })   
    return databaseEntry
  }

  const deleteFile = (file, id, location) => {
    const selectedFile = firebase.storage().ref(`${location}/${id}/${file}`)
    selectedFile.delete().then(function() {
    }).catch(function(error) {
      console.log(error)
    });
  }

  // const deleteAllFiles = (file, id, location) => {
  //   file.forEach(download => {
  //     const selectedFile = firebase.storage().ref(`${location}/${id}/${download}`)
  //     selectedFile.delete().then(function() {

  //     }).catch(function(error) {
  //       console.log(error)
  //     })
  //   })
  // }

  const getImageURL = (item, id, location) => {
    const storageRef = firebase.storage().ref(`${location}/${id}/${item.image}`)
    storageRef.getDownloadURL().then(function(url) {

      const img = document.getElementById('output')
      img.src = url;
    }).catch(function(error) {
    })
    console.log("image-loaded");
  }

  getImageURL(item, item.id, "images")

  const loadFile = (e) => {
    e.persist()
    if (e) {
      if (e.target.files.length > 0) {
        changeImage("image", `${e.target.files[0].name}`)
        setTimeout(function(){
          const output = document.getElementById("output");
          output.src = URL.createObjectURL(e.target.files[0]);
          output.onload = function() {
          URL.revokeObjectURL(output.src)
          }
        }, 1000)
      }
    }

  }

  const loadAllFiles = (e) => {
    setDuplicateFileWarning(false)
    setDuplicateFiles([]);
    const upload = e.target.files;
    const allFiles = Array.from(upload)
    const existingFiles = item.download;
    const existingUploads = filesToUpload;
    const duplicates = [];
    console.log(allFiles)
    allFiles.map(file => {
      const duplicate = existingFiles.includes(file.name)
      if (duplicate === true) {
        setDuplicateFileWarning(true);
        return duplicates.push(file.name);
      } else {
        return (existingFiles.push(file.name), existingUploads.push(file)) 
      }
    })
    console.log(existingFiles)
    console.log(filesToUpload)
    setDuplicateFiles([...duplicates])
    changeDownloads("download", existingFiles)
    document.getElementById("download").value = "";
  }

  const handleCancel = () => {
    navigate("/admin/subjectList")
  }
  
    return (
      <div className="database-form">
        <div>
          <h2>Update Resource</h2>
        </div>

        <form onSubmit={onSubmit}>
        <div className="form-warning">
        {warning && <div>Some fields have been left blank. Please complete all fields (including downloads) before submitting the form</div>}
        {nameWarning && <div>Resource name is already being used by another resource in the database. Please edit or delete this resource first, or choose another name for this resource.</div>}
          </div>
          
          <div className="form-container">
            
            <div className="form-fields">
              <h2>Resource Information</h2>
              <input type="text" name="name" value={item.name} onChange={onChange} />
              <textarea className="input-description" type="text" name="description" value={item.description} onChange={onChange}/>
              
              <input placeholder="Category" type="text" name="category" value={item.category} list="categoryList" onChange={onChange}/>
               
               {allCategories && 
               <datalist id="categoryList">
                
                {allCategories.map(singleCategory => {
                  return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                })}  
                </datalist>
              }

              
              <input placeholder="Level"value={item.level} name="level" list="levelList" onChange={onChange} type="level"/>
              {allLevels && 
                <datalist id="levelList">
                {allLevels.map(singleLevel => {
                    return <option key={singleLevel.id} value={singleLevel.name}>{singleLevel.name}</option>
                  })}  
                </datalist>  
              }
              <input placeholder="Add a tag" value={tag} name="tags" list="tagsList" onChange={e => setTag(e.currentTarget.value)} type="tags"/>
              <button onClick={(e) => addTag(e, tag)}>Add Tag</button>
              
              {allTags &&
              <datalist id="tagsList">
                {allTags.map(singleTag => {
                  return <option key={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
                })}
              </datalist>
              }
                
              <p>Tags added:</p>
              <div className="tags-container">
              {item.tags == "" ?
              <p>No tags to display</p>
              :  
              item.tags.map(singleTag => {
                return <div>
                  <label for={singleTag} key={item.tags.indexOf(singleTag)} id={item.tags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                  <button name={singleTag} onClick={(e) => deleteTag(e, item.tags.indexOf(singleTag))}>Delete Tag</button>
                  </div>
              })
              }
              
              {tagWarning && <p>Maximum of four tags. Please delete a tag before adding a new one</p>}
              {duplicateWarning && <p>Tag already selected. Please select a different tag</p>}
              </div>
             
              {/* <input type="text" name="category" value={item.category} onChange={onChange}/>
              <input type="text" name="level" value={item.level} onChange={onChange}/> */}
              {/* <input type="text" name="tags" value={tagString} onChange={(e) => setTagString(e.currentTarget.value)}/>
              <button type="button" onClick={() => changeTags(tagString)}>Update Tags</button> */}

            </div>

            <div className="form-downloads">

              <div>
                <h2>Upload Image</h2>
                <div className="image-container">
                  { item.image == "" ?
                  <p>No Profile Image</p>
                :
                  <img className="preview" id="output" alt="Loading Image..."></img>
                }
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div>
                <h2>Upload Resources</h2>
                <input onChange={(e) => loadAllFiles(e)} type="file" id="download" name="download" multiple/>
                <p>Files:</p>
                { item.download == "" ?
                <div>
                  <p>No files added</p>
                </div>
                :
                item.download.map(file => (
                  <div>
                <label>{file}</label>
                <button onClick={(e) => removeFile(e, file, item.download.indexOf(file))}>Remove File</button>
                </div>
                ))}
                {duplicateFileWarning && <p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>}
                {duplicateFiles.length > 0 && <p>Duplicate files:</p>}
                {duplicateFiles.length > 0 && duplicateFiles.map(file => (
                <p>{file}</p>
              ))}
              </div>
            
            </div>
          </div>

          <div>
            <button type="button" onClick={() => handleCancel()}>Cancel</button>
            <button type="submit" >Update</button>
          </div>
        </form>
        
      </div>
  )
}

export default UpdateItem