import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const UpdateItem = ({ setEditing, currentItem }) => {
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
    }, []);
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

      console.log(originalName);
      console.log(item.name);
      console.log(nameCheck.length);
      
      if (nameCheck.length > 0) {
        setNameWarning(true);
      } else {

          if (categoryCheck.length == 0) {
            addDatabaseField(item.category, "categories")
          }
    
          if (levelCheck.length == 0) {
            addDatabaseField(item.level, "levels")
          }

          item.tags.forEach(async tag => {
            const tagCheck = await databaseCheck(tag, "tags")
            if (tagCheck.length == 0) {
              addDatabaseField(tag, "tags")
            }
          })
        }
        
        if (originalImage !== item.image) {
          deleteFile(originalImage, item.id, `images`)
          uploadFile('image', item.id, 'images')
        }
  
        filesToDelete.forEach(file => {
          if (item.download.includes(file) == true) {
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
    
        setEditing(false);
        
    } else {
      setWarning(true)
    }   
    console.log(nameWarning);
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

  const deleteAllFiles = (file, id, location) => {
    file.forEach(download => {
      const selectedFile = firebase.storage().ref(`${location}/${id}/${download}`)
      selectedFile.delete().then(function() {

      }).catch(function(error) {
        console.log(error)
      })
    })
  }

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
    if (e) {
      changeImage("image", `${e.target.files[0].name}`)
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
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
        duplicates.push(file.name);
        setDuplicateFileWarning(true);
      } else {
        existingFiles.push(file.name)
        existingUploads.push(file)
      }
    })
    console.log(existingFiles)
    console.log(filesToUpload)
    setDuplicateFiles([...duplicates])
    changeDownloads("download", existingFiles)
  }
  
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Update Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
        {warning && <div>Some fields have been left blank. Please complete all fields (including downloads) before submitting the form</div>}

          <div className="form-content">
            
            <div className="form-fields">
              <p>Resource Information</p>
              <input type="text" name="name" value={item.name} onChange={onChange} />
              <textarea className="input-description" type="text" name="description" value={item.description} onChange={onChange}/>
              
              <input placeholder="Category" type="text" name="category" value={item.category} list="categoryList" onChange={onChange}/>
               <datalist id="categoryList">
                
                {allCategories.map(singleCategory => {
                  return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                })}  
                </datalist>
              
              <input placeholder="Level"value={item.level} name="level" list="levelList" onChange={onChange} type="level"/>
                <datalist id="levelList">
                {allLevels.map(singleLevel => {
                    return <option key={singleLevel.id} value={singleLevel.name}>{singleLevel.name}</option>
                  })}  
                </datalist>  

              <input placeholder="Add a tag" value={tag} name="tags" list="tagsList" onChange={e => setTag(e.currentTarget.value)} type="tags"/>
              <button onClick={(e) => addTag(e, tag)}>Add Tag</button>
              <datalist id="tagsList">
                {allTags.map(singleTag => {
                  return <option key={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
                })}
              </datalist>
              <p>Tags added:</p>
              {item.tags.map(singleTag => {
                return <div>
                  <label for={singleTag} key={item.tags.indexOf(singleTag)} id={item.tags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                  <button name={singleTag} onClick={(e) => deleteTag(e, item.tags.indexOf(singleTag))}>Delete Tag</button>
                  </div>
              })}
              {tagWarning && <p>Maximum of four tags. Please delete a tag before adding a new one</p>}
              {duplicateWarning && <p>Tag already selected. Please select a different tag</p>}
              
             
              {/* <input type="text" name="category" value={item.category} onChange={onChange}/>
              <input type="text" name="level" value={item.level} onChange={onChange}/> */}
              {/* <input type="text" name="tags" value={tagString} onChange={(e) => setTagString(e.currentTarget.value)}/>
              <button type="button" onClick={() => changeTags(tagString)}>Update Tags</button> */}

            </div>

            <div className="form-uploads">

              <div className="image-upload-container">
                <label htmlFor="image">Upload Image</label>
                <div className="form-preview">
                  <img className="image-preview" id="output" alt=""></img>
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div className="resource-upload-container">
                <label htmlFor="download">Upload Resources</label>
                <input onChange={(e) => loadAllFiles(e)} type="file" id="download" name="download" multiple/>
                <p>Files:</p>
                {
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

          <div className="form-submit">
            <button onClick={()=>setEditing(false)}>Cancel</button>
            <button type="submit" >Update</button>
          </div>
        </form>
        
      </div>
  )
}

export default UpdateItem