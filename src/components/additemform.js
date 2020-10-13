import React, { useState, useEffect } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = ({setAddResource}) => {

    const database = firebase.firestore()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    
    const [tag, setTags] = useState("");

    const [imageUpload, setImageUpload] = useState("")
    
    const [fileUploads, setFileUploads] = useState([])

    const [allCategories, setAllCategories] = useState([])
    const [allLevels, setAllLevels] = useState([])
    const [allTags, setAllTags] = useState([])
    
    const [warning, setWarning] = useState(false);
    const [tagWarning, setTagWarning] = useState(false);
    const [nameWarning, setEntryWarning] = useState(false);

    const [addedTags, setAddedTags] = useState([])

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

    const addTag = (e, tag) => {
      e.preventDefault()
      if (tag === "") {
        return
      } else if (addedTags.length === 4) {
        setTagWarning(true);
      } else {
        addedTags.push(tag)
        setTags("");
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
      const newFiles = fileUploads
      newFiles.splice(index, 1)
      setFileUploads([...newFiles])
    }
  
    const uploadFile = (name, file, location) => {
      const selectedFile = document.getElementById(file).files[0];
      const storageRef = firebase.storage().ref(`${location}/${name}/${selectedFile.name}`)
      storageRef.put(selectedFile)
      return `${selectedFile.name}`
    }

    const uploadMultipleFiles = (name, file, location) => {
      const selectedFiles = fileUploads;
      const fileList = Array.from(selectedFiles);
      const databaseEntry = fileList.map(file => {
        return `${file.name}`
      });
      fileList.forEach(file => {
        const storageRef = firebase.storage().ref(`${location}/${name}/${file.name}`)
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
      const upload = e.target.files;
      const allFiles = Array.from(upload)
      const existingFiles = fileUploads;
      allFiles.map(file => {
        return existingFiles.push(file)
      })
      setFileUploads([...existingFiles])
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
      if (name && description && category && level && addedTags && imageUpload && fileUploads) {
      const nameCheck = await databaseCheck(name, "items")
      console.log(nameCheck)
      console.log(nameCheck.length);
      const categorySearch = allCategories.find(singleCategory => singleCategory.name === category);
      const levelSearch = allLevels.find(singleLevel => singleLevel.name === level)

      if (nameCheck.length > 0) {
        setEntryWarning(true);
      } else {

          if (categorySearch === undefined) {
            addDatabaseField(category, "categories")
          }
    
          if (levelSearch === undefined) {
            addDatabaseField(level, "levels")
          }
    
          addedTags.forEach(addedTag => {
            const tagSearch = allTags.find(singleTag => singleTag.name === addedTag)
    
            if (tagSearch === undefined) {
              addDatabaseField(addedTag, "tags")
            }
          }) 
          
          const tags = addedTags;
          const image = uploadFile(name, 'image', 'images')
          const download = uploadMultipleFiles(name, 'download', 'downloads')
          
          // adding item to database 
          firebase
          .firestore()
          .collection("items")
          .add({
              name,
              image,
              description,
              category,
              level,
              tags,
              download
            })
          .then(() => setName(""), setDescription(''), setCategory(""), setLevel(""))
        
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

              <input placeholder="Add a tag" value={tag} name="tags" list="tagsList" onChange={e => setTags(e.currentTarget.value)} type="tags"/>
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