import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const UpdateItem = ({ setEditing, currentItem, updateItem }) => {
  const [item, setItem] = useState(currentItem);
  const [oldImage] = useState(item.image)
  const [oldDownloads] = useState(item.download)
  const [fileUploads, setFileUploads] = useState(item.download)

  const [newUploads, setNewUploads] = useState([])
  const [filesToDelete, setFilesToDelete] = useState([])

  const [uploads, setUploads] = useState([])
  const [tag, setTag] = useState("");
  const [addedTags, setAddedTags] = useState(item.tags)

  const [tagWarning, setTagWarning] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateFileWarning, setDuplicateFileWarning] = useState(false);

  const [duplicateFiles, setDuplicateFiles] = useState([])

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

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

  const onSubmit = e => {
    e.preventDefault();
    findDownloadsToDelete(item.download, oldDownloads)

    if (oldImage !== item.image) {
      deleteFile(oldImage, item.id, `images`)
      uploadFile('image', item.id, 'images')
    }
    if (fileUploads !== item.download) {
      // changeDownloads(fileUploads)
      // deleteAllFiles(filesToDelete, item.id, `downloads`)
      // uploadMultipleFiles('download', item.id, 'downloads')
      
    }
    updateItem({ currentItem }, item);
  };

  const onChange = e => {
    const { name, value } = e.target
    setItem({ ...item, [name]: value })
  }

  const addTag = (e, tag) => {
    e.preventDefault()
    setTagWarning(false)
    setDuplicateWarning(false)
    if (tag === "") {
      return
    } else if (addedTags.includes(tag)) {
      setDuplicateWarning(true);
    } else if (addedTags.length === 4) {
      setTagWarning(true);
    } else {
      addedTags.push(tag)
      changeTags(addedTags)
      setTag("");
    } 
  }

  const findDownloadsToDelete = (array1, array2) => {
    const difference = array1.filter(x => !array2.includes(x))
    console.log(difference);
  }

  const deleteTag = (e, index) => {
    e.preventDefault()
    const newTags = addedTags
    newTags.splice(index, 1)
    setAddedTags([...newTags])
    changeTags(addedTags)
    setTagWarning(false);
  }

  const removeFile = (e, index) => {
    e.preventDefault()
    filesToDelete.push(fileUploads[index])
    const newFiles = fileUploads
    newFiles.splice(index, 1)
    setFileUploads([...newFiles])
    changeDownloads("download", newFiles)
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

  const uploadFile = (file, id, location) => {
    const selectedFile = document.getElementById(file).files[0];
    const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
    storageRef.put(selectedFile)
    return `${selectedFile.name}`
  }

  const uploadMultipleFiles = (file, id, location) => {
    const selectedFiles = document.getElementById(file).files;
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
  }

  const loadFile = (e) => {
    changeImage("image", `${e.target.files[0].name}`)
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }   
  }

  const loadAllFiles = (e) => {
    const upload = e.target.files;
    const allFiles = Array.from(upload)
    const existingFiles = fileUploads;
    console.log(existingFiles);
    const duplicates = [];
    allFiles.map(file => {
      const duplicate = existingFiles.includes(file.name)
      if (duplicate === true) {
        setDuplicateFileWarning(true)
        duplicateFiles.push(file.name)
      } else {
        existingFiles.push(file.name)
        newUploads.push(file.name)
      }
    })
    console.log(existingFiles)
    setFileUploads([...existingFiles])
    // changeDownloads([...existingFiles])
  }
  
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Update Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
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
              {addedTags.map(singleTag => {
                return <div>
                  <label for={singleTag} key={addedTags.indexOf(singleTag)} id={addedTags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                  <button name={singleTag} onClick={(e) => deleteTag(e, addedTags.indexOf(singleTag))}>Delete Tag</button>
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
                  {getImageURL(item, item.id, "images")}
                  <img className="image-preview" id="output" alt=""></img>
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div className="resource-upload-container">
                <label htmlFor="download">Upload Resources</label>
                <input onChange={(e) => loadAllFiles(e)} type="file" id="download" name="download" multiple/>
                <p>Files:</p>
                {
                fileUploads.map(file => (
                  <div>
                <label>{file}</label>
                <button onClick={(e) => removeFile(e, fileUploads.indexOf(file))}>Remove File</button>
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