import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const UpdateItem = ({ setEditing, currentItem, updateItem }) => {
  const [item, setItem] = useState(currentItem);
  // const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const onSubmit = e => {
    e.preventDefault();
    updateItem({ currentItem }, item);
  };

  const onChange = e => {
    const { name, value } = e.target
    setItem({ ...item, [name]: value })
  }

  const getImageURL = (item) => {
    const storageRef = firebase.storage().ref(`${item.image}`)
    storageRef.getDownloadURL().then(function(url) {

      const img = document.getElementById('output')
      img.src = url;
    }).catch(function(error) {
    })
  }

  const loadFile = (e) => {
    // setUpdatedImage(true);
    const output = document.getElementById("output");
    console.log(output)
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }   
  }
  
    return (
      <div className="database-form-container">
        <div className="form-header">
          <h2>Update Resource</h2>
        </div>

        <form className="form-container" onSubmit={onSubmit}>
          <div className="form-content">
            
            <div className="form-fields">
              <label>Resource Information</label>
              <input type="text" name="name" value={item.name} onChange={onChange} />
              <textarea className="input-description" type="text" name="description" value={item.description} onChange={onChange}/>
              <input type="text" name="category" value={item.category} onChange={onChange}/>
              <input type="text" name="level" value={item.level} onChange={onChange}/>
              <input type="text" name="tags" value={item.tags} onChange={onChange}/>
            </div>

            <div className="form-uploads">

              <div className="image-upload-container">
                <label for="image">Upload Image</label>
                <div className="form-preview">
                  {getImageURL(item)}
                  <img className="image-preview" id="output"></img>
                </div>
                  <input onChange={(e) => loadFile(e)} accept="image/*" placeholder="Image" id="image" name="image"type="file"/>
              </div>

              <div className="resource-upload-container">
                <label for="download">Upload Resources</label>
                <input type="file" id="download" name="download" multiple/>
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