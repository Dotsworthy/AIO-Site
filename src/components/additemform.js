import React, { useState, useEffect } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = ({setAddResource}) => {

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
      addedTags.push(tag)
      setTags("");
    }

    const deleteTag = (e, index) => {
      e.preventDefault()
      addedTags.splice(index, 1)
    }
  
    const uploadFile = (file, location) => {
      const selectedFile = document.getElementById(file).files[0];
      const storageRef = firebase.storage().ref(`${location}/${selectedFile.name}`)
      storageRef.put(selectedFile)
      return `${selectedFile.name}`
    }

    const uploadMultipleFiles = (file, location) => {
      const selectedFiles = document.getElementById(file).files;
      const fileList = Array.from(selectedFiles);
      const databaseEntry = fileList.map(file => {
        return `${file.name}`
      });
      fileList.forEach(file => {
        const storageRef = firebase.storage().ref(`${location}/${file.name}`)
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
      setFileUploads([...allFiles]);
    }

    const handleTags = (string) => {
      let tagsList = string.replace(/\s/g,'');
      let output = tagsList.split(",");
      return output
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

    const onSubmit = e => {
      e.preventDefault()
      if (name && description && category && level && addedTags && imageUpload && fileUploads) {
      const categorySearch = allCategories.find(singleCategory => singleCategory.name === category);
      const levelSearch = allLevels.find(singleLevel => singleLevel.name === level)
      // const tagSearch = allTags.find(singleTag => singleTag.name == tags)

      if (categorySearch == undefined) {
        addDatabaseField(category, "categories")
      }

      if (levelSearch == undefined) {
        addDatabaseField(level, "levels")
      }

      // if (tagSearch == undefined) {
      //   addDatabaseField(tags, "tags")
      // }
      
        // Adding file to database
      // const tags = handleTags(tagString)
      const tags = addedTags;
      const image = uploadFile('image', 'images')
      const download = uploadMultipleFiles('download', 'downloads')
      
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
      } else {
        setWarning(true);
        let search = allCategories.find(singleCategory => singleCategory.name == category);
        console.log(search);
      }
    }
 
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Add Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
          {warning && <div>Not all fields are complete. Please complete all fields before submitting the form</div>}
          <div className="form-content">

            <div className="form-fields">
              <p>Resource Information</p>
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              <textarea className="input-description" placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              
              <input placeholder="Category" type="text" name="category" value={category} list="categoryList" onChange={e => setCategory(e.currentTarget.value)} type="text"/>
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
                <p>{file.name}</p>
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