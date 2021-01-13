import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

// ISSUES:
// Need to test that uploads and downloads are working properly.

const UpdateSubject = ({ currentItem, setEditing }) => {

  // item information to update the database
  const [item, setItem] = useState(currentItem);
  const database = firebase.firestore()
    
  // states for changed data that needs processing
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [filesToDelete] = useState([])
  const [tag, setTag] = useState("");

  // warnings for duplicate entries and maximum entries
  const [duplicateFiles, setDuplicateFiles] = useState([])
  const [folderSize, setFolderSize] = useState(0)

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

  useEffect(() => {
    let newFolderSize = 0
    item.download.map(file => {
      const storageRef = firebase.storage().ref(`downloads/${item.id}/${file}`)
      storageRef.getMetadata().then(function(metadata) {
        console.log(metadata);
        const fileSize = metadata.size / 1024 / 1024
        newFolderSize += fileSize;
        console.log(newFolderSize);
        setFolderSize(newFolderSize);
      }).catch(function(error) {
        console.log(error);
      })
    })
    
  }, [])
  
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
    if (tag === "") {
      return
    } else if (item.tags.includes(tag)) {
      document.getElementById("warning-dialog-box").style.visibility = "visible";
      document.getElementById("duplicate-tags").style.display = "block";
      setTag("")
    } else if (item.tags.length === 4) {
      document.getElementById("warning-dialog-box").style.visibility = "visible";
      document.getElementById("max-tags-reached").style.display = "block";
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
  }

  // changing downloads
  const removeFile = (e, file, fileIndex) => {
    e.preventDefault()

    const findUploads = []
    filesToUpload.map(object => { findUploads.push(object.name) })
    
    const findFile = item.download.find(function(element, index) { return index === fileIndex; })
    
    if (findUploads.includes(findFile)) {
      let file = filesToUpload.filter(file => {
        return file.name === findFile
      })
    let newFolderSize = folderSize
    newFolderSize -= file[0].size / 1024 / 1024;
    setFolderSize(newFolderSize);
    } else {
      const storageRef = firebase.storage().ref(`downloads/${item.id}/${file}`)
      storageRef.getMetadata().then(function(metadata) {
        let newFolderSize = folderSize
        newFolderSize -= metadata.size / 1024 / 1024;
        setFolderSize(newFolderSize);
      })
    }

    const newFiles = item.download
    newFiles.splice(fileIndex, 1)
    filesToDelete.push(file)
    changeDownloads("download", newFiles)
  }

  const fileUploader = async (fileList, file, id, location) => {

    await Promise.all(fileList.map(file => {
      return new Promise(function (resolve, reject) {
        const storageRef = firebase.storage().ref(`${location}/${id}/${file.name}`)
        const uploadTask = storageRef.put(file)

        uploadTask.on('state_changed', 
        function progress(snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let result = progress.toFixed(0);
          document.getElementById(file.name).innerHTML = `${file.name} ${result}% complete`;
        }, function error(err) {
          reject(err);
        }, function complete() {
          resolve(uploadTask);
        });
      }).then(function() {
        return
      })
    }))
  }

  // Uploads a single file. Used for Images. 
  const uploadFile = (file, id, location) => {
    const selectedFile = document.getElementById(file).files[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
      storageRef.put(selectedFile)
    }
  }

 

  // Uploads multiple files. Used for resource downloads
  const uploadMultipleFiles = async (file, id, location) => {
    const selectedFiles = file;
    const fileList = Array.from(selectedFiles);
    const databaseEntry = fileList.map(file => {
      return `${file.name}`
    });

    await fileUploader(fileList, file, id, location)

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
    setDuplicateFiles([]);
    const upload = e.target.files;
    const allFiles = Array.from(upload)
    const existingFiles = Array.from(item.download);
    const existingUploads = Array.from(filesToUpload);
    const duplicates = [];
    console.log(allFiles)
    allFiles.map(file => {
      const duplicate = existingFiles.includes(file.name)
      console.log(duplicate);
      let newFolderSize = folderSize;
      newFolderSize += file.size / 1024 / 1024
      console.log(newFolderSize);

      if (duplicate === true) {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("duplicate-files").style.display = "block";
        return duplicates.push(file);
      } 
      
      if (newFolderSize > 50) {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("file-too-large").style.display = "block";
      }
      
      if (duplicate === false && newFolderSize <= 50) {
      setFolderSize(newFolderSize);
        return (existingFiles.push(file.name), existingUploads.push(file)) 
      }
    })
    setDuplicateFiles([...duplicates]);
    changeDownloads("download", existingFiles);
    setFilesToUpload(existingUploads);
    document.getElementById("download").value = "";
  }
  
    // submission form
    const onSubmit = async e => {
      e.preventDefault();
      if (item.name && item.description && item.category && item.level && 
        item.tags.length > 0 
        && 
        item.image 
        && item.download.length > 0
        ) {
        const nameCheck = await databaseCheck(item.name, "subjects")
        const categoryCheck = await databaseCheck(item.category, "categories")
        const levelCheck = await databaseCheck(item.level, "levels")
  
        if (originalName !== item.name && nameCheck.length > 0) {
          document.getElementById("warning-dialog-box").style.visibility = "visible";
          document.getElementById("duplicate-name").style.display = "block";
        } else {
          document.getElementById("update-item-form").style.visibility = "hidden";
          document.getElementById("output").style.visibility = "hidden";
          document.getElementById("submit-dialog-box").style.visibility = "visible";
  
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
          
          await uploadMultipleFiles(filesToUpload, item.id, "downloads")
          
          filesToDelete.forEach(file => {
            if (item.download.includes(file) === true) {
              return
            } else {
              deleteFile(file, item.id, "downloads")
            }
          })  
  
          if (originalImage !== item.image) {
            deleteFile(originalImage, item.id, `images`)
            uploadFile('image', item.id, 'images')
          }
  
        firebase
        .firestore()
        .collection("subjects")
        .doc(item.id)
        .update(item)
  
  
          setEditing(false);
        }
      } else {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("incomplete-form").style.display = "block";
      }   
    };
  
  const handleCancel = () => {
      setEditing(false);
  }

  const warningCancel = () => {
    document.getElementById("warning-dialog-box").style.visibility = "hidden";
    document.getElementById("incomplete-form").style.display = "none";
    document.getElementById("duplicate-name").style.display = "none";
    document.getElementById("max-tags-reached").style.display = "none";
    document.getElementById("duplicate-tags").style.display = "none";
    document.getElementById("duplicate-files").style.display = "none";
    document.getElementById("file-too-large").style.display = "none";
  }
  
    return (
      <div className="admin-layout">
        <div className="popup-container" id="warning-dialog-box">

          <div className="form-header">
            <h2>Warning</h2>
          </div>

          <div className="popup-content">
            <div id="incomplete-form">Not all fields are complete. Please complete all fields before submitting the form</div>
            <div id="duplicate-name">{item.name} already refers to an resource in the database. Either update the original resource, delete the original resource first, or choose a different name for the resource</div>
            <div id="max-tags-reached">Maximum of four tags. Please delete a tag before adding a new one</div>
            <div id="duplicate-tags">Tag already selected. Please select a different tag</div>
            <div id="file-too-large"><p>The total size of all files attached cannot exceed 50mb.</p></div>
            <div id="duplicate-files"><p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>
              <br></br>
              <p>Duplicate files:</p>
              <div className="form-inside-content">
                {duplicateFiles.map(file => {
                  return <div className="added-item"><p>{file.name}</p></div>
                })
                }
              </div>
            </div>
            
          </div>
        
          <div className="form-footer">
            <button onClick={() => warningCancel()}>Close</button>
          </div>
        
        </div>
        
        
        <div className="database-form" id="update-item-form">
          <div className="form-header">
              <h2>Update Resource</h2>
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-container">
              <div className="form-fields">
                <h2>Resource Information</h2>

                {/* NAME */}
                <input type="text" name="name" value={item.name} onChange={onChange} />
                
                {/* DESCRIPTION */}
                <textarea className="input-description" type="text" name="description" value={item.description} onChange={onChange}/>
                
                {/* CATEGORY */}
                <input placeholder="Category" type="text" name="category" value={item.category} list="categoryList" onChange={onChange}/>
                {allCategories && 
                <datalist id="categoryList">
                  {allCategories.map(singleCategory => {
                    return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                  })}  
                  </datalist>
                }

                {/* LEVEL */}
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
                
                {/* TAGS */}
                {allTags &&
                <datalist id="tagsList">
                  {allTags.map(singleTag => {
                    return <option key={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
                  })}
                </datalist>
                }

                <p className="tags-added-adjustment">Tags added:</p>
                <div className="form-inside-content">
                {item.tags === "" ?
                <p>No tags to display</p>
                :  
                item.tags.map(singleTag => {
                  return <div className="added-item">
                    <label for={singleTag} key={item.tags.indexOf(singleTag)} id={item.tags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                    <button name={singleTag} onClick={(e) => deleteTag(e, item.tags.indexOf(singleTag))}>Delete Tag</button>
                    </div>
                })
                }
                
                
              </div>

            </div>

            <div className="form-downloads">

                {/* IMAGE */}
              <div>
                <h2>Upload Image</h2>
                <div className="image-container">
                  { item.image === "" ?
                  <p>No Profile Image</p>
                :
                  <img className="preview" id="output" alt="Loading..."></img>
                }
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

                {/* DOWNLOADS */}
              <div>
                <h2>Upload Resources</h2>
                <input onChange={(e) => loadAllFiles(e)} type="file" id="download" name="download" multiple/>
                <p>Files:</p>
                
                <div className="form-inside-content">
                  { item.download === "" ?
                <div><p>No files added</p></div>
                :
                  item.download.map(file => (
                    <div className="added-item">
                  <label>{file}</label>
                  <button onClick={(e) => removeFile(e, file, item.download.indexOf(file))}>Remove File</button>
                  </div>
                  ))}
                </div>
              </div>
            
            </div>
            </div>

            <div className="form-footer">
              <button type="button" onClick={() => handleCancel()}>Cancel</button>
              <button type="submit" >Update</button>
            </div>
          </form>
        </div>  

        <div className="popup-container" id="submit-dialog-box">

        <div className="form-header">
            <h2>Submitting Resource</h2>
          </div>
          
          <div className="pop-up-content"><h2>Submitting Resource</h2></div>
          <div>
          <p>Uploading files. Do NOT refresh or leave the page while files are uploading. (If your upload has failed you can try again by updating the resource)</p>
          </div>
          <div>
          {filesToUpload.map(resource => {
            return <p id={resource.name}>Uploading...{resource.name}</p>
          })
        }
        </div>
          </div>
      </div>
    
  )
}

export default UpdateSubject