import React, { useEffect, useState } from "react"
import firebase from "firebase"
import { navigate } from "gatsby"
import 'firebase/storage'

const AddItemForm = () => {

    // database location
    const database = firebase.firestore()

    // fields for updating database
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [tag, setTag] = useState("");
    const [addedTags, setAddedTags] = useState([])
    const [imageUpload, setImageUpload] = useState("")
    const [resourceUploads, setResourceUploads] = useState([])   

    // validation hooks for form.
    const [warning, setWarning] = useState(false);
    const [tagWarning, setTagWarning] = useState(false);
    const [nameWarning, setNameWarning] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(false);
    const [duplicateFileWarning, setDuplicateFileWarning] = useState(false);
    const [duplicateFiles, setDuplicateFiles] = useState([])

    // This React hook generates lists for the item form.
    const useItems = (location) => {
      const [items, setItems] = useState([]);
      useEffect(() => {
        database.collection(location).onSnapshot(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setItems(listItems);
          });
      }, [location]);
      return items;
    };
    
    const allCategories = useItems("categories");
    const allLevels = useItems("levels");
    const allTags = useItems("tags");

    // Prepares and validates tags for addition to the database
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
        setTag("");
      } 
    }

    const deleteTag = (e, index) => {
      e.preventDefault()
      const newTags = addedTags
      newTags.splice(index, 1)
      setAddedTags([...newTags])
      setTagWarning(false);
    }

    // Loads profile image to display on the form and prepares them for addition to the database
    const prepareProfileImage = (e, htmlLocation) => {
      if (e.target.files.length > 0) {
        createPreview(e, htmlLocation)
        const file = e.target.files;
        setImageUpload(file)
      } 
    }

    const createPreview = (e, htmlLocation) => {
      const htmlElement = document.getElementById(htmlLocation);
        htmlElement.src = URL.createObjectURL(e.target.files[0]);
        htmlElement.onload = function() {
        URL.revokeObjectURL(htmlElement.src)
      }
    }

    // Loads and validates file uploads and prepares them for adding to the database 
    const prepareAllFiles = (e) => {
      setDuplicateFileWarning(false)
      setDuplicateFiles([])
      const allFiles = Array.from(e.target.files)
      console.log(allFiles);
      const existingFiles = resourceUploads;
      const duplicates = [];
      allFiles.map(file => {
        const duplicate = existingFiles.filter(existingFile => existingFile.name === file.name)
        if (duplicate.length > 0) {
          setDuplicateFileWarning(true)
          return duplicates.push(file)
        } else {
          return existingFiles.push(file)
        }
      })
      setResourceUploads([...existingFiles])
      setDuplicateFiles([...duplicates])
    }

    const removeFile = (e, index) => {
      e.preventDefault()
      setDuplicateFileWarning(false);
      setDuplicateFiles([])
      const newFiles = resourceUploads
      newFiles.splice(index, 1)
      setResourceUploads([...newFiles])
    }
  
    const uploadSingleFile = async (file, id, location) => {
      const selectedFile = document.getElementById(file).files[0];
      const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
      storageRef.put(selectedFile)
      return `${selectedFile.name}`
    }

    const uploadAllFiles = async (file, id, location) => {
      const selectedFiles = resourceUploads;
      const fileList = Array.from(selectedFiles);
      const databaseEntry = fileList.map(file => {
        return `${file.name}`
      });
      fileList.forEach(file => {
        const storageRef = firebase.storage().ref(`${location}/${id}/${file.name}`)
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', function(snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: 
            console.log('Upload is paused')
            break;
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running');
            break;
          }

        }, function(error) {
          console.log('Upload unsuccessful')
        }, function() {
          return console.log('Upload successful')
        })
      })   
      return databaseEntry
    }

    const addDatabaseField = (name, location) => {
      firebase
      .firestore()
      .collection(location)
      .add({
        name
      })
    }

    const addResource = (name, description, category, level, tags, location) => {
      firebase
      .firestore()
      .collection(location)
      .add({
        name,
        description,
        category,
        level,
        tags
      })
    }

    const updateResource = (image, download, location, id) => {
      firebase
      .firestore()
      .collection(location)
      .doc(id)
      .update({
        image,
        download
      })
    }

    const databaseCheck = async (name, location) => {
        let query = []
        const snapshot = await database
        .collection(location)
        .where("name", "==", name)
        .get()
        
        snapshot.forEach((doc) => query.push(doc))
        console.log(query);
        return query
    }

    const onSubmit = async e => {
      e.preventDefault()
      if (name && description && category && level && addedTags && imageUpload && resourceUploads.length > 0) {
      const nameCheck = await databaseCheck(name, "items")
      const categoryCheck = await databaseCheck(category, "categories")
      const levelCheck = await databaseCheck(level, "levels")
      
      if (nameCheck.length > 0) {
        setNameWarning(true);
      } else {

          if (categoryCheck.length === 0) {
            addDatabaseField(category, "categories")
          }
    
          if (levelCheck.length === 0) {
            addDatabaseField(level, "levels")
          }
    
          addedTags.forEach(async addedTag => {
            const tagCheck = await databaseCheck(addedTag, "tags")
            if (tagCheck.length === 0) {
              addDatabaseField(addedTag, "tags")
            }
          }) 
          
          const tags = addedTags;
          
          addResource(name, description, category, level, tags, "items")
          const databaseEntry = await databaseCheck(name, "items")

          const image = await uploadSingleFile('image', databaseEntry[0].id, 'images')
          const download = await uploadAllFiles('download', databaseEntry[0].id, 'downloads')
          
          updateResource(image, download, "items", databaseEntry[0].id)
          navigate("/admin/subjectList")
        }
      } else {
        setWarning(true);
      }
    }

    const handleCancel = () => {
      navigate("/admin/subjectList")
    }
 
    return (
      <div className="database-form">        
        <div>
          <h2>Add Resource</h2>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-warning">
          {warning && <div>Not all fields are complete. Please complete all fields before submitting the form</div>}
          {nameWarning && <div>{name} already refers to an resource in the database. Either update the original resource, delete the original resource first, or choose a different name for the resource</div>}
          </div>
          <div className="form-container">

            <div className="form-fields">
              <h2>Resource Information</h2>
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              <textarea placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              
              <input placeholder="Category" type="text" name="category" value={category} list="categoryList" onChange={e => setCategory(e.currentTarget.value)}/>
               <datalist id="categoryList">
                
                {allCategories.map(singleCategory => {
                  return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                })}  
                </datalist>
              
              <input placeholder="Level"value={level} name="level" list="levelList" onChange={e => setLevel(e.currentTarget.value)} type="level"/>
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
              <div className="tags-container">
              {addedTags.map(singleTag => {
                return <div >
                  <label htmlFor={singleTag} key={addedTags.indexOf(singleTag)} id={addedTags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                  <button name={singleTag} onClick={(e) => deleteTag(e, addedTags.indexOf(singleTag))}>Delete Tag</button>
                  </div>
              })}
              {/* <div className="warning-container"> */}
              {tagWarning && <div>Maximum of four tags. Please delete a tag before adding a new one</div>}
              {duplicateWarning && <div>Tag already selected. Please select a different tag</div>}
              {/* </div> */}
              </div>
            </div>

            <div className="form-downloads">

              <div>
              <h2>Upload Image</h2>
              <div className="image-container">
                <img id="preview" alt=""></img>
              </div>
              <input onChange={(e) => prepareProfileImage(e, "preview")} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div>
              <h2>Upload Resources</h2>
              <input onChange={(e) => {prepareAllFiles(e)}}type="file" id="download" name="download" multiple/>
              <p>Files to upload:</p>
              {resourceUploads.length > 0 ? 
              resourceUploads.map(file => (
                <div>
                <label>{file.name}</label>
                <button onClick={(e) => removeFile(e, resourceUploads.indexOf(file))}>Remove File</button>
                </div>
              ))
              :
              <p>None</p>}
              {duplicateFileWarning && <p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>}
              {duplicateFiles.length > 0 && <p>Duplicate files:</p>}
              {duplicateFiles.length > 0 && duplicateFiles.map(file => (
                <p>{file.name}</p>
              ))}
              </div>

            </div>
          </div>

          <div>
            <button type="submit" name="submit" onClick={() => handleCancel()} value="Cancel">Cancel</button>
            <button type="submit" name="submit" className="form-submit">Submit</button>
          </div>
        </form>
    </div>
    )
  }

export default AddItemForm