import React, { useState } from "react"
import firebase from "firebase"
import 'firebase/storage'

const AddItemForm = ({setAddResource}) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [tagString, setTagString] = useState("")
    const [uploads, setUploads] = useState([])
  
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
    }

    const loadAllFiles = (e) => {
      const upload = e.target.files;
      const allFiles = Array.from(upload)
      setUploads([...allFiles]);
    }

    const handleTags = (string) => {
      let tagsList = string.replace(/\s/g,'');
      let output = tagsList.split(",");
      console.log(output);
      return output
    }


    const handleCancel = () => {
      setAddResource(false);
    }

    const onSubmit = e => {
      e.preventDefault()
      // Adding file to database
      const tags = handleTags(tagString)
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
      .then(() => setName(""), setDescription(''), setCategory(""), setLevel(""), setTagString(""))
    
      setAddResource(false);
    }
 
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Add Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
          <div className="form-content">

            <div className="form-fields">
              <p>Resource Information</p>
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              <textarea className="input-description" placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              <input placeholder="Category" value={category} name="category" onChange={e => setCategory(e.currentTarget.value)} type="text"/>
              <input placeholder="Level"value={level} name="level" onChange={e => setLevel(e.currentTarget.value)} type="level"/>
              <input placeholder="Tags" value={tagString} name="tags" onChange={e => setTagString(e.currentTarget.value)} type="tags"/>
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
              {uploads.length > 0 ? 
              uploads.map(file => (
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