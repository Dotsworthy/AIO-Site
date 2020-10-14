import React, { useEffect, useState } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = ({setAddResource}) => {

    const database = firebase.firestore()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [tag, setTag] = useState("");

    const [imageUpload, setImageUpload] = useState("")
    const [fileUploads, setFileUploads] = useState([])    
    const [warning, setWarning] = useState(false);
    const [tagWarning, setTagWarning] = useState(false);
    const [nameWarning, setEntryWarning] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(false);
    const [duplicateFileWarning, setDuplicateFileWarning] = useState(false);

    const [addedTags, setAddedTags] = useState([])
    const [duplicateFiles, setDuplicateFiles] = useState([])

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

    const removeFile = (e, index) => {
      e.preventDefault()
      setDuplicateFileWarning(false);
      setDuplicateFiles([])
      const newFiles = fileUploads
      newFiles.splice(index, 1)
      setFileUploads([...newFiles])
    }
  
    const uploadFile = (file, id, location) => {
      const selectedFile = document.getElementById(file).files[0];
      const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
      storageRef.put(selectedFile)
      return `${selectedFile.name}`
    }

    const uploadMultipleFiles = (file, id, location) => {
      const selectedFiles = fileUploads;
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

    const loadFile = (e) => {
      const preview = document.getElementById("preview");
      preview.src = URL.createObjectURL(e.target.files[0]);
      preview.onload = function() {
        URL.revokeObjectURL(preview.src)
      }
      const file = e.target.files;
      setImageUpload(file);
    }

    const loadAllFiles = (e) => {
      setDuplicateFileWarning(false)
      setDuplicateFiles([])
      const upload = e.target.files;
      const allFiles = Array.from(upload)
      const existingFiles = fileUploads;
      const duplicates = [];
      allFiles.map(file => {
        const duplicate = existingFiles.filter(existingFile => existingFile.name === file.name)
        if (duplicate.length > 0) {
          setDuplicateFileWarning(true)
          duplicates.push(file)
        } else {
          return existingFiles.push(file)
        }
      })
      setFileUploads([...existingFiles])
      setDuplicateFiles([...duplicates])
    }

    const handleCancel = () => {
      setAddResource(false);
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

    const getData = async (location) => {
      let query = []
      const snapshot = await database.collection(location).get()
    
      snapshot.forEach((doc) =>  query.push(doc.data()))
      return query
    }

    const onSubmit = async e => {
      e.preventDefault()
      if (name && description && category && level && addedTags && imageUpload && fileUploads) {
      const nameCheck = await databaseCheck(name, "items")
      const categoryCheck = await databaseCheck(category, "categories")
      const levelCheck = await databaseCheck(level, "levels")

      console.log(nameCheck);
      console.log(categoryCheck);
      console.log(levelCheck);
      if (nameCheck.length > 0) {
        setEntryWarning(true);
      } else {

          if (categoryCheck.length == 0) {
            addDatabaseField(category, "categories")
          }
    
          if (levelCheck.length == 0) {
            addDatabaseField(level, "levels")
          }
    
          addedTags.forEach(async addedTag => {
            const tagCheck = await databaseCheck(addedTag, "tags")
            if (tagCheck.length == 0) {
              addDatabaseField(addedTag, "tags")
            }
          }) 
          
          const tags = addedTags;
          
          addResource(name, description, category, level, tags, "items")
          const databaseEntry = await databaseCheck(name, "items")

          const image = uploadFile('image', databaseEntry[0].id, 'images')
          const download = uploadMultipleFiles('download', databaseEntry[0].id, 'downloads')
          console.log(image);
          console.log(download);
          
          updateResource(image, download, "items", databaseEntry[0].id)
          setAddResource(false);
        }
      } else {
        setWarning(true);
      }
    }
 
    return (
      <div className="database-form-container">        
        <div className="form-header">
          <h2>Add Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
          {warning && <div>Not all fields are complete. Please complete all fields before submitting the form</div>}
          {nameWarning && <div>{name} already refers to an resource in the database. Either update the original resource, delete the original resource first, or choose a different name for the resource</div>}
          <div className="form-content">

            <div className="form-fields">
              <p>Resource Information</p>
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              <textarea className="input-description" placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              
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
                  return <option ket={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
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
            </div>

            <div className="form-uploads">

              <div className="image-upload-container">
              <label htmlFor="image">Upload Image</label>
              <div className="form-preview">
                <img className="image-preview" id="preview" alt=""></img>
              </div>
              <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div className="resource-upload-container">
              <label htmlFor="download">Upload Resources</label>
              <input onChange={(e) => {loadAllFiles(e)}}type="file" id="download" name="download" multiple/>
              <p>Files to upload:</p>
              {fileUploads.length > 0 ? 
              fileUploads.map(file => (
                <div>
                <label>{file.name}</label>
                <button onClick={(e) => removeFile(e, fileUploads.indexOf(file))}>Remove File</button>
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

          <div className="form-submit">
            <button type="submit" name="submit" onClick={() => handleCancel()} value="Cancel">Cancel</button>
            <button type="submit" name="submit" className="form-submit">Submit</button>
          </div>
        </form>
    </div>
    )
  }

export default AddItemForm