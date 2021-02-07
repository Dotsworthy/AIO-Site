import React, { useEffect, useState } from "react"
import firebase from "firebase"
import { navigate } from "gatsby"
import 'firebase/storage'

const AddSubject = () => {

  // comment change?
    // database location. Needed for some functions.
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

    // validation hook for form.
    const [duplicateFiles, setDuplicateFiles] = useState([])
    const [folderSize, setFolderSize] = useState(0);

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
    
    // Auto-complete for form fields.
    const allCategories = useItems("categories");
    const allLevels = useItems("levels");
    const allTags = useItems("tags");

    // Prepares and validates tags for addition to the database.
    const addTag = (e, tag) => {
      e.preventDefault()
      if (tag === "") { return } 
      else if (addedTags.includes(tag)) { 
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("duplicate-tags").style.display = "block";
        setTag("")
      } 
      else if (addedTags.length === 4) { 
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("max-tags-reached").style.display = "block";
      } 
      else {
        addedTags.push(tag)
        setTag("");
      } 
    }

    // Deletes a tag from the list of tags to be created.
    const deleteTag = (e, index) => {
      e.preventDefault()
      const newTags = addedTags
      newTags.splice(index, 1)
      setAddedTags([...newTags])
    }

    // Loads profile image to display on the form and prepares them for addition to the database.
    const prepareProfileImage = (e, htmlLocation) => {
      if (e.target.files.length > 0) {
        createPreview(e, htmlLocation)
        setImageUpload(e.target.files)
      } else if (e.target.files.length === 0) {
        createPreview(e, htmlLocation)
        setImageUpload("")
      }
    }

    // sends selected image file to JSX to render image. NOTE. clicking the upload image button and pressing cancel will remove the image from image uploads but does not remove preview. To fix.
    const createPreview = (e, htmlLocation) => {
      const htmlElement = document.getElementById(htmlLocation);
      console.log(htmlElement);
      if (e.target.files.length > 0) {
        
        htmlElement.src = URL.createObjectURL(e.target.files[0]);
        console.log(htmlElement.src);
        htmlElement.style.visibility = "visible";
        htmlElement.onload = function() {
        URL.revokeObjectURL(htmlElement.src);
        } 
        console.log(htmlElement.src);
      } else {
        htmlElement.src = "";
      }
    }



    // Loads and validates file uploads and prepares them for adding to the database 
    const prepareAllFiles = (e) => {
      setDuplicateFiles([])
      const allFiles = Array.from(e.target.files)
      console.log(e.target.files);
      const existingFiles = resourceUploads;
      const duplicates = [];
      allFiles.map(file => {
        const duplicate = existingFiles.filter(existingFile => existingFile.name === file.name)
        let newFolderSize = folderSize;
        newFolderSize += file.size / 1024 / 1024

        if (duplicate.length > 0) {
          document.getElementById("warning-dialog-box").style.visibility = "visible";
          document.getElementById("duplicate-files").style.display = "block";
          return duplicates.push(file)
        }
        
        if (newFolderSize > 50) {
          document.getElementById("warning-dialog-box").style.visibility = "visible";
          document.getElementById("file-too-large").style.display = "block";
        }       

        if (duplicate.length === 0 && newFolderSize <= 50) {
          setFolderSize(newFolderSize);
          return existingFiles.push(file)
        }
      })
      setResourceUploads([...existingFiles])
      setDuplicateFiles([...duplicates])
    }

    // Uploads a single file to the database. Used for profile images.
    const uploadSingleFile = (file, id, location) => {
      const selectedFile = imageUpload[0];
      if (selectedFile) {
      const storageRef = firebase.storage().ref(`${location}/${id}/${selectedFile.name}`)
      storageRef.put(selectedFile)
      return `${selectedFile.name}`
      } else {
        return
      }
    }

    // Uploads each download to the database and renders html to show download progress
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

    // removes download from list of downloads to be updated.
    const removeFile = (e, fileIndex) => {
      e.preventDefault()
      setDuplicateFiles([])
      const findFile = resourceUploads.find(function(element, index) {
        return index === fileIndex;
      })
      let newFolderSize = folderSize
      newFolderSize -= findFile.size / 1024 / 1024;
      setFolderSize(newFolderSize);
      const newFiles = resourceUploads
      newFiles.splice(fileIndex, 1)
      setResourceUploads([...newFiles])
    }

    // uploads all files to the database. NOTE: this function needs to be refactored to prevent crash if there are no uploads.
    const uploadAllFiles = async (file, id, location) => {
      const selectedFiles = resourceUploads;
      const fileList = Array.from(selectedFiles);
      const databaseEntry = fileList.map(file => {
        return `${file.name}`
      });

      await fileUploader(fileList, file, id, location)
      return databaseEntry
    }

    // adds newly created categories, levels and tags to the database
    const addDatabaseField = (name, location) => {
      firebase.firestore().collection(location).add({
        name
      })
    }

    // Initial creation of resource in firebase database. Image and Download are added seperately on upload.
    const addResource = (name, description, category, level, tags, location) => {
      // creates placeholder database fields in case of download issues.
      let download = "";
      let image = "";
      firebase.firestore().collection(location).add({
        name,
        description,
        category,
        level,
        tags,
        image,
        download
      })
    }

    // Updates the newly created resource. Used once profile image and downloads have been uploaded to Firebase.
    const updateResource = (image, download, location, id) => {
      firebase.firestore().collection(location).doc(id).update({
        image,
        download,
      })
    }

    // Looks for resources, categories, levels or tags in the database with the same name on the form.
    const databaseCheck = async (name, location) => {
        let query = []
        const snapshot = await database.collection(location).where("name", "==", name).get()    
        snapshot.forEach((doc) => query.push(doc))
        return query
    }

    const onSubmit = async e => {
      e.preventDefault()
      if (name && description && category && level && addedTags && imageUpload && resourceUploads.length > 0) {

      const nameCheck = await databaseCheck(name, "subjects")
      const categoryCheck = await databaseCheck(category, "categories")
      const levelCheck = await databaseCheck(level, "levels")
      
      if (nameCheck.length > 0) {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("duplicate-name").style.display = "block";
      } else {
        document.getElementById("add-item-form").style.visibility = "hidden";
        document.getElementById("preview").style.visibility = "hidden";
        document.getElementById("submit-dialog-box").style.visibility = "visible";

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
          
          addResource(name, description, category, level, tags, "subjects")

          const databaseEntry = await databaseCheck(name, "subjects")
          
          let image
          if (imageUpload === "") {
            image = ""
          } else {
            image = await uploadSingleFile('image', databaseEntry[0].id, 'images')
          }

          let download
          if (resourceUploads === []) {
            download = ""
          } else {
            download = await uploadAllFiles('download', databaseEntry[0].id, 'downloads')
          }
          
          updateResource(image, download, "subjects", databaseEntry[0].id)

          navigate("/admin/subjectList")
        }
      } else {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("incomplete-form").style.display = "block";
      }
    }

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
            <div id="duplicate-name">{name} already refers to an resource in the database. Either update the original resource, delete the original resource first, or choose a different name for the resource</div>
            <div id="max-tags-reached">Maximum of four tags. Please delete a tag before adding a new one</div>
            <div id="duplicate-tags">Tag already selected. Please select a different tag</div>
            <div id="file-too-large"><p>The total size of all files attached cannot exceed 50mb.</p></div>
            <div id="duplicate-files"><p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>
              <br></br>
              <p>Duplicate files:</p>
              <div className="form-inside-content">
              {duplicateFiles.map(file => {
                  return <div className="added-item"> <p>{file.name}</p> </div>
              })
              }
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button onClick={() => warningCancel()}>Close</button>
          </div>

      </div>

      <div className="database-form" id="add-item-form">
        <div className="form-header">
          <h2>Add Subject</h2>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-container">

            <div className="form-fields">

              <div className="form-subfield">
              <h3>Subject Description</h3>
              
              {/* NAME */}
              <input placeholder="Subject Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              
              {/* DESCRIPTION */}
              <textarea placeholder="Subject Description" maxLength="2000" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              </div>



            <div className="form-subfield">
              <h3>Subject Details </h3>
              <p>Click to select from dropdown or start typing to search. Anything typed into the text box not in the database will be added.</p>

              {/* CATEGORY */}
              <input placeholder="Category" type="text" name="category" value={category} list="categoryList" onChange={e => setCategory(e.currentTarget.value)}/>
               {allCategories &&
                <datalist id="categoryList">  
                {allCategories.map(singleCategory => {
                  return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                })
                }  
                </datalist>
              }
              
              {/* LEVEL */}
              <input placeholder="Level"value={level} name="level" list="levelList" onChange={e => setLevel(e.currentTarget.value)} type="level"/>
                {allLevels &&
                <datalist id="levelList">
                {allLevels.map(singleLevel => {
                    return <option key={singleLevel.id} value={singleLevel.name}>{singleLevel.name}</option>
                  })}  
                </datalist>  
              }

              {/* TAGS */}
              
              <div className="button-menu-container">
              <input placeholder="Tags" value={tag} name="tags" list="tagsList" onChange={e => setTag(e.currentTarget.value)} type="tags"/>
              <button onClick={(e) => addTag(e, tag)}>Add Tag</button>
              </div>

                {allTags &&
                <datalist id="tagsList">
                {allTags.map(singleTag => {
                  return <option key={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
                })}
                </datalist>
                }
                  <p>Tags added (4 maximum):</p>
                  <div className="form-inside-content" id="tags">
                    
                            {addedTags.length === 0 ?
                            <p>None</p>
                            :
                            addedTags.map(singleTag => {
                            return <div className="added-item">
                              <label htmlFor={singleTag} key={addedTags.indexOf(singleTag)} id={addedTags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                              <button name={singleTag} onClick={(e) => deleteTag(e, addedTags.indexOf(singleTag))}>Delete Tag</button>
                              </div>
                            })
                            }
                  </div>

              

            </div>

            </div> 

             {/* IMAGE */}  
            <div className="form-fields-notext">
              <div className="form-subfield">
              <div>
                <h3>Profile Image</h3>
                <p>This image will be used on the resource catalogue</p>
              </div>

              <div className="image-container">

                <div>
                  <p>Profile Image</p>          
                  <div className="catalogue-profile-image">
                    <img id="preview" alt="No Profile "></img>
                  </div >
                </div>  
                
                <div>
                  <p>Profile Card Image</p>
                  <div className ="catalogue-card-image">
                    <img id="preview-2" alt="No profile"></img>
                  </div>
                </div>

              </div>

              <input className="custom-file-input" onChange={(e) => prepareProfileImage(e, "preview")} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>

              </div>
            </div>


            {/* <div className="form-downloads"> */}
              
             

              {/* DOWNLOADS */}
              <div className="form-fields-notext">
                <div className="form-subfield">
              <h3>Upload Resources</h3>

              <p>Files to upload (Maximum total size 50mb):</p>
                <div className="form-inside-content" id="downloads">
                  
                    {resourceUploads.length > 0 ? 
                    resourceUploads.map(file => (
                      <div className="added-item">
                      <label>{file.name}</label>
                      <button onClick={(e) => removeFile(e, resourceUploads.indexOf(file))}>Remove File</button>
                      </div>
                    ))
                    :
                    <p>No files added</p>}
                </div>

              <input className="custom-file-input" onChange={(e) => {prepareAllFiles(e)}}type="file" id="download" name="download" multiple/>
              </div>
            </div>
              
                
              
            {/* </div> */}

            

            

            
            
          </div>
          <div className="form-footer">
            <button type="submit" name="submit" onClick={() => handleCancel()} value="Cancel">Cancel</button>
            <button type="submit" name="submit" className="form-submit">Submit</button>
          </div>
          
        </form>

        </div>
        <div className="popup-container" id="submit-dialog-box">

          <div className="form-header">
            <h2>Submitting Resource</h2>
          </div>

          <div className="popup-content">
            <p>Uploading files. Do NOT refresh or leave the page while files are uploading. (If your upload has failed you can try again by updating the resource)</p>
            <br></br>
            <div className="form-inside-content">
            {resourceUploads.map(resource => {
              return <div className="added-item"><p id={resource.name}>Uploading...{resource.name}</p></div>
            })
            }
            </div>
          </div>
        </div>
    </div>
    )
  }

export default AddSubject