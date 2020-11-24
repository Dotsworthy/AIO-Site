import React, { useState, useEffect } from "react";
import { navigate } from "gatsby"

import firebase from "firebase"
import 'firebase/storage'

// ISSUES:
// If resource has an image assigned to the image field but no corresponding image in cloud storage. Trying to upload that image will not work. User can upload a new image with different file name however. This is not something the user should run into.

const UpdateItem = ({ currentItem }) => {

  // item information to update the database
  const [item, setItem] = useState(currentItem);
  const database = firebase.firestore()
    
  // states for changed data that needs processing
  const [filesToUpload] = useState([])
  const [filesToDelete] = useState([])
  const [tag, setTag] = useState("");

  // warnings for duplicate entries and maximum entries
  const [duplicateFiles, setDuplicateFiles] = useState([])

  // for rendering upload pop-up
  const [submit, setSubmit] = useState(false)

  
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
  const removeFile = (e, file, index) => {
    e.preventDefault()
    const newFiles = item.download
    newFiles.splice(index, 1)
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
    const existingUploads = filesToUpload;
    const duplicates = [];
    console.log(allFiles)
    allFiles.map(file => {
      const duplicate = existingFiles.includes(file.name)
      if (duplicate === true) {
        console.log(duplicate);
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("duplicate-files").style.display = "block";
        return duplicates.push(file);
      } else {
        return (existingFiles.push(file.name), existingUploads.push(file)) 
      }
    })
    setDuplicateFiles([...duplicates])
    changeDownloads("download", existingFiles)
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
        const nameCheck = await databaseCheck(item.name, "items")
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
        .collection("items")
        .doc(item.id)
        .update(item)
  
  
          navigate("/admin/subjectList")
        }
      } else {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("incomplete-form").style.display = "block";
      }   
    };
  
  const handleCancel = () => {
    navigate("/admin/subjectList")
  }

  const warningCancel = () => {
    document.getElementById("warning-dialog-box").style.visibility = "hidden";
    document.getElementById("incomplete-form").style.display = "none";
    document.getElementById("duplicate-name").style.display = "none";
    document.getElementById("max-tags-reached").style.display = "none";
    document.getElementById("duplicate-tags").style.display = "none";
    document.getElementById("duplicate-files").style.display = "none";
  }
  
    return (
      <div>
        <div className="popup-container" id="warning-dialog-box">
        <div className="popup-content">
          <div id="incomplete-form">Not all fields are complete. Please complete all fields before submitting the form</div>
          <div id="duplicate-name">{item.name} already refers to an resource in the database. Either update the original resource, delete the original resource first, or choose a different name for the resource</div>
          <div id="max-tags-reached">Maximum of four tags. Please delete a tag before adding a new one</div>
          <div id="duplicate-tags">Tag already selected. Please select a different tag</div>
          <div id="duplicate-files">
            <p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>
            <p>Duplicate files:</p>
            {duplicateFiles.map(file => (
              <p>{file.name}</p>
            ))
            }
            </div>
          <button onClick={() => warningCancel()}>Close</button>
        </div>
        </div>
        
        
        <div className="database-form" id="update-item-form">

          <form onSubmit={onSubmit}>

            <div className="form-header">
              <h2>Update Resource</h2>
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

export default UpdateItem