import React, { useEffect, useState } from "react"
import firebase from "firebase"
import { navigate } from "gatsby"
import 'firebase/storage'

// ISSUES
// Profile image has issues.
// Uploads has issues.
// Is name check working?

// Changing of CSS when sumbit is pressed.

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
    
    // file uploading and confirmation
    const [submit, setSubmit] = useState(false)

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
      setTagWarning(false)
      setDuplicateWarning(false)
      if (tag === "") { return } 
      else if (addedTags.includes(tag)) { 
        setDuplicateWarning(true)
        setTag("")
      } 
      else if (addedTags.length === 4) { setTagWarning(true);} 
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
      setTagWarning(false);
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
      if (e.target.files.length > 0) {
        
        htmlElement.src = URL.createObjectURL(e.target.files[0]);
        htmlElement.style.visibility = "visible";
        htmlElement.onload = function() {
        URL.revokeObjectURL(htmlElement.src);
        } 
      } else {
        htmlElement.style.visibility = "hidden";
      }
    }

    // Loads and validates file uploads and prepares them for adding to the database 
    const prepareAllFiles = (e) => {
      setDuplicateFileWarning(false)
      setDuplicateFiles([])
      const allFiles = Array.from(e.target.files)
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
    const removeFile = (e, index) => {
      e.preventDefault()
      setDuplicateFileWarning(false);
      setDuplicateFiles([])
      const newFiles = resourceUploads
      newFiles.splice(index, 1)
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
      firebase
      .firestore()
      .collection(location)
      .add({
        name
      })
    }

    // Initial creation of resource in firebase database. Image and Download are added seperately on upload.
    const addResource = (name, description, category, level, tags, location) => {
      // creates placeholder database fields in case of download issues.
      let download = "";
      let image = "";
      firebase
      .firestore()
      .collection(location)
      .add({
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
      firebase
      .firestore()
      .collection(location)
      .doc(id)
      .update({
        image,
        download
      })
    }

    // Looks for resources, categories, levels or tags in the database with the same name on the form.
    const databaseCheck = async (name, location) => {
        let query = []
        const snapshot = await database
        .collection(location)
        .where("name", "==", name)
        .get()
        
        snapshot.forEach((doc) => query.push(doc))
        return query
    }

    // is namecheck working?
    const onSubmit = async e => {
      e.preventDefault()
      if (
        name && 
        description && 
        category && 
        level && 
        addedTags 
        && 
        imageUpload && 
        resourceUploads.length > 0
        ) {
      const nameCheck = await databaseCheck(name, "items")
      const categoryCheck = await databaseCheck(category, "categories")
      const levelCheck = await databaseCheck(level, "levels")
      
      if (nameCheck.length > 0) {
        setNameWarning(true);
      } else {
        setSubmit(true);

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
          
          let image
          if (imageUpload == "") {
            image = ""
          } else {
            image = await uploadSingleFile('image', databaseEntry[0].id, 'images')
          }

          let download
          if (resourceUploads == []) {
            download = ""
          } else {
            download = await uploadAllFiles('download', databaseEntry[0].id, 'downloads')
          }
          
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
              
              {/* NAME */}
              <input placeholder="Name" value={name} name="name" onChange={e => setName(e.currentTarget.value)} type="text"/>
              
              {/* DESCRIPTION */}
              <textarea placeholder="Description" value={description} name="Description" onChange={e => setDescription(e.currentTarget.value)} type="text"/>
              
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
              <div className="tag-container">
              <input placeholder="Add a tag" value={tag} name="tags" list="tagsList" onChange={e => setTag(e.currentTarget.value)} type="tags"/>
              <button onClick={(e) => addTag(e, tag)}>Add Tag</button>

              {allTags &&
              <datalist id="tagsList">
                {allTags.map(singleTag => {
                  return <option key={singleTag.id} value={singleTag.name}>{singleTag.name}</option>
                })}
              </datalist>
              }
              <div className="added-tags-container">
                <p>Tags added:</p>
                {addedTags.length == 0 ?
                <p>None</p>
                :
                addedTags.map(singleTag => {
                  return <div>
                    <label htmlFor={singleTag} key={addedTags.indexOf(singleTag)} id={addedTags.indexOf(singleTag)} name={singleTag}>{singleTag}</label>
                    <button name={singleTag} onClick={(e) => deleteTag(e, addedTags.indexOf(singleTag))}>Delete Tag</button>
                    </div>
                })
                }
              </div>
              <div className="warning-container">
              {tagWarning && <div>Maximum of four tags. Please delete a tag before adding a new one</div>}
              {duplicateWarning && <div>Tag already selected. Please select a different tag</div>}
              </div>
              
              </div>
            </div>

            
            <div className="form-downloads">

              {/* IMAGE */}  
              <div>
              <h2>Upload Image</h2>
              <div className="image-container">
                <img id="preview" alt=""></img>
              </div>
              <input onChange={(e) => prepareProfileImage(e, "preview")} accept="image/*" placeholder="Image" id="image" name="image" type="file"/>
              </div>

              {/* DOWNLOADS */}
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
              <div className="warning-container">
              {duplicateFileWarning && <p>One or more of your files are already on the list of downloads. Delete this download first before reuploading</p>}
              {duplicateFiles.length > 0 && <p>Duplicate files:</p>}
              {duplicateFiles.length > 0 && duplicateFiles.map(file => (
                <p>{file.name}</p>
              ))}
              </div>
              </div>

            </div>
          </div>

          <div>
            <button type="submit" name="submit" onClick={() => handleCancel()} value="Cancel">Cancel</button>
            <button type="submit" name="submit" className="form-submit">Submit</button>
          </div>
        </form>

        {submit && <div className="popup-container">
          <div className="pop-up-content"><h2>Submitting Resource</h2></div>
          <div>
          <p>Uploading files. Do NOT refresh or leave the page while files are uploading. (If your upload has failed you can try again by updating the resource)</p>
          </div>
          <div>
          {resourceUploads.map(resource => {
            return <p id={resource.name}>Uploading...{resource.name}</p>
          })
        }
        </div>
          </div>}
    </div>
    )
  }

export default AddItemForm