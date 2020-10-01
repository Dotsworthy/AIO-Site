import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const UpdateItem = ({ setEditing, currentItem, updateItem }) => {
  const [item, setItem] = useState(currentItem);
  const [oldImage] = useState(item.image)
  const [oldDownloads] = useState(item.download)
  const [uploads, setUploads] = useState([])
  const [tagString, setTagString] = useState(item.tags)

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const onSubmit = e => {
    e.preventDefault();
    changeTags(tagString)
    console.log(item.tags)
    if (oldImage !== item.image) {
      deleteFile(oldImage, `images`)
      uploadFile('image', 'images')
    }
    if (oldDownloads !== item.download) {
      deleteAllFiles(oldDownloads, `downloads`)
      uploadMultipleFiles('download', 'downloads')
    }
    updateItem({ currentItem }, item);
  };

  const onChange = e => {
    const { name, value } = e.target
    setItem({ ...item, [name]: value })
  }

  const changeTags = (string) => {
    let tagsList = string.replace(/\s/g,'');
    const name = 'tags'
    const value = tagsList.split(",")
    console.log(value)
    setItem({...item, [name]: value})
    console.log(item)
  }

  const changeImage = (file, location) => {
    const name = file;
    const value = location;
    setItem({...item, [name]: value})
  }

  const changeDownloads = (e, entry) => {
    const fileList = Array.from(e.target.files)
    const name = entry
    const value = fileList.map(file => {
      return `${file.name}`
    })
    setItem({...item, [name]: value})
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

  const deleteFile = (file, location) => {
    const selectedFile = firebase.storage().ref(`${location}/${file}`)
    selectedFile.delete().then(function() {
    }).catch(function(error) {
      console.log(error)
    });
  }

  const deleteAllFiles = (file, location) => {
    file.forEach(download => {
      const selectedFile = firebase.storage().ref(`${location}/${download}`)
      selectedFile.delete().then(function() {

      }).catch(function(error) {
        console.log(error)
      })
    })
  }

  const getImageURL = (item, location) => {
    const storageRef = firebase.storage().ref(`${location}/${item.image}`)
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
    changeDownloads(e, "download", "downloads")
    const upload = e.target.files;
    console.log(upload)
    const allFiles = Array.from(upload)
    setUploads([...allFiles]);
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
              <input type="text" name="category" value={item.category} onChange={onChange}/>
              <input type="text" name="level" value={item.level} onChange={onChange}/>
              <input type="text" name="tags" value={tagString} onChange={(e) => setTagString(e.currentTarget.value)}/>
            </div>

            <div className="form-uploads">

              <div className="image-upload-container">
                <label htmlFor="image">Upload Image</label>
                <div className="form-preview">
                  {getImageURL(item, "images")}
                  <img className="image-preview" id="output" alt=""></img>
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              <div className="resource-upload-container">
                <label htmlFor="download">Upload Resources</label>
                <input onChange={(e) => loadAllFiles(e)} type="file" id="download" name="download" multiple/>
                <p>Files:</p>
                { uploads.length > 0 ?
                  uploads.map(file => (
                    <p key={file.name}>{file.name}</p>
                 ))
                :
                oldDownloads.map(file => (
                  <p key={file}>{file}</p>
                ))}
              </div>
            
            </div>
          </div>

          <div className="form-submit">
            <button onClick={()=>setEditing(false)}>Cancel</button>
            <button>Update</button>
          </div>
        </form>
        
      </div>
  )
}

export default UpdateItem