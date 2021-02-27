import React, { useEffect, useState } from "react";
import {triggerFormLock, disableScroll, enableScroll, resetAllWarnings} from "./Utils/errorHandler";
// import {databaseCheck} from "./Utils/firebaseUtils";
import firebase from "firebase";
import { navigate } from "gatsby";
import 'firebase/storage';

const AddSubject = () => {

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

  // Looks for a resource with the name specified and returns the results in an array.
const databaseCheck = async (name, location) => {
  let query = []
  const snapshot = await database.collection(location).where("name", "==", name).get()
  snapshot.forEach((doc) => query.push(doc))
  return query
}

  // Auto-complete for form fields.
  const allCategories = useItems("categories");
  const allLevels = useItems("levels");
  const allTags = useItems("tags");

  // Updates the database fields and removes any error messages on input. Images and Downloads are done seperately.
  const changeField = (warning, e) => {
    switch (warning) {
      case "name":
        setName(e);
        document.getElementById("no-name").style.display = "none";
        document.getElementById("duplicate-name").style.display = "none";
        break;
      case "description":
        setDescription(e);
        document.getElementById("no-description").style.display = "none";
        break;
      case "category":
        setCategory(e);
        document.getElementById("no-category").style.display = "none";
        break;
      case "level":
        setLevel(e);
        document.getElementById("no-level").style.display = "none";
        break;
      case "tags":
        setTag(e);
        document.getElementById("no-tags").style.display = "none";
        document.getElementById("max-tags-reached").style.display = "none";
        document.getElementById("duplicate-tags").style.display = "none";
        break;
      default:
        break;
    }
  }

  // Prepares and validates tags for addition to the database.
  const addTag = (e, tag) => {
    e.preventDefault()

    if (tag === "") { return }
    else if (addedTags.includes(tag)) {
      document.getElementById("duplicate-tags").style.display = "block";
      setTag("")
    }
    else if (addedTags.length === 4) {
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
    document.getElementById("max-tags-reached").style.display = "none";
    document.getElementById("duplicate-tags").style.display = "none";
    const newTags = addedTags
    newTags.splice(index, 1)
    setAddedTags([...newTags])
  }

  // Loads profile image to display on the form and prepares them for addition to the database.
  const prepareProfileImage = (e, htmlLocation) => {
    if (e.target.files.length > 0) {
      document.getElementById("no-image").style.display = "none";
      htmlLocation.forEach(id => {
        createPreview(e, id)
      })
      // createPreview(e, htmlLocation)
      setImageUpload(e.target.files)
    } else if (e.target.files.length === 0) {
      // createPreview(e, htmlLocation)
      // setImageUpload("")
      return
    }
  }

  // sends selected image file to JSX to render image. NOTE. clicking the upload image button and pressing cancel will remove the image from image uploads but does not remove preview. To fix.
  const createPreview = (e, htmlLocation) => {
    const htmlElement = document.getElementById(htmlLocation);
    if (e.target.files.length > 0) {

      htmlElement.src = URL.createObjectURL(e.target.files[0]);
      console.log(htmlElement.src);
      htmlElement.style.visibility = "visible";
      htmlElement.onload = function () {
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
    document.getElementById("duplicate-files").style.display = "none";
    document.getElementById("file-too-large").style.display = "none";
    document.getElementById("no-downloads").style.display = "none";

    const allFiles = Array.from(e.target.files)
    const existingFiles = resourceUploads;
    const duplicates = [];

    allFiles.forEach(file => {
      const duplicate = existingFiles.filter(existingFile => existingFile.name === file.name)
      let newFolderSize = folderSize;
      newFolderSize += file.size / 1024 / 1024

      if (duplicate.length > 0) {
        document.getElementById("duplicate-files").style.display = "block";
        return duplicates.push(file)
      }

      if (newFolderSize > 50) {
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
      }).then(function () {
        return
      })
    }))
  }

  // removes download from list of downloads to be updated.
  const removeFile = (e, fileIndex) => {
    e.preventDefault()
    document.getElementById("duplicate-files").style.display = "none";
    document.getElementById("file-too-large").style.display = "none";
    setDuplicateFiles([])
    const findFile = resourceUploads.find(function (element, index) {
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

  const onSubmit = async e => {
    e.preventDefault()
    resetAllWarnings()

    if (name && description && category && level && addedTags && imageUpload && resourceUploads.length > 0) {

      const nameCheck = await databaseCheck(name, "subjects")
      const categoryCheck = await databaseCheck(category, "categories")
      const levelCheck = await databaseCheck(level, "levels")

      if (nameCheck.length > 0) {
        document.getElementById("warning-dialog-box").style.visibility = "visible";
        document.getElementById("incomplete-form").style.display = "block";
        document.getElementById("duplicate-name").style.display = "block";
        disableScroll();
        triggerFormLock("add-item-form");
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
      disableScroll();
      triggerFormLock("add-item-form");

      document.getElementById("warning-dialog-box").style.visibility = "visible";
      document.getElementById("incomplete-form").style.display = "block";
      document.getElementById("add-item-form").disabled = true;


      if (!name) { document.getElementById("no-name").style.display = "block"; }
      if (!description) { document.getElementById("no-description").style.display = "block"; }
      if (!category) { document.getElementById("no-category").style.display = "block"; }
      if (!level) { document.getElementById("no-level").style.display = "block"; }
      if (addedTags.length === 0) { document.getElementById("no-tags").style.display = "block"; }
      if (!imageUpload) { document.getElementById("no-image").style.display = "block"; }
      if (resourceUploads.length === 0) { document.getElementById("no-downloads").style.display = "block"; }

      return
    }
  }

  const handleCancel = () => {
    navigate("/admin/subjectList")
  }

  const warningCancel = () => {
    document.getElementById("warning-dialog-box").style.visibility = "hidden";
    triggerFormLock("add-item-form");
    enableScroll();
  }

  return (
    <div className="admin-layout">
      <div className="popup-container" id="warning-dialog-box">
        <div className="form-header">
          <h2>Warning</h2>
        </div>

        <div className="popup-content">
          <div id="incomplete-form">There are issues with your form. Please fix errors highlighted in red.</div>
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
                <div className="input-container">
                  <div className="input-field">
                    <label htmlFor="name" className="name_label">Subject Name:</label>
                    <input placeholder="Subject Name" value={name} name="name" id="name" onChange={e => changeField("name", e.currentTarget.value)} type="text" />
                  </div>
                  <div id="duplicate-name">A subject named {name} already exists.</div>
                  <div id="no-name">Please give your subject a name.</div>
                </div>

                {/* DESCRIPTION */}
                <p>Write a preview of your subject. This is viewed by users to the resource catalogue, and could include a small introduction of the topic, an overview of the lesson plan, etc. (max characters: 3000)</p>
                <div className="vertical-input-container">
                  <div className="description-input-field">
                    <textarea placeholder="Subject Description" maxLength="2000" value={description} name="Description" onChange={e => changeField("description", e.currentTarget.value)} type="text" />
                  </div>
                  <div id="no-description">Please give your subject a description</div>
                </div>

              </div>
              <div className="form-subfield">
                <h3>Subject Details </h3>
                <p>Click to select from dropdown or start typing to search. Any text in the input field not currently in the database will be added.</p>

                {/* CATEGORY */}
                <div className="input-container">
                  <div className="input-field">
                    <label>Category:</label>
                    <input placeholder="Category" type="text" name="category" value={category} list="categoryList" onChange={e => changeField("category", e.currentTarget.value)} />
                    {allCategories &&
                      <datalist id="categoryList">
                        {allCategories.map(singleCategory => {
                          return <option key={singleCategory.id} value={singleCategory.name}>{singleCategory.name}</option>
                        })
                        }
                      </datalist>
                    }
                  </div>
                  <div id="no-category">Please give your subject a category</div>
                </div>

                {/* LEVEL */}
                <div className="input-container">
                  <div className="input-field">
                    <label>Educational Level:</label>
                    <input placeholder="Educational Level" value={level} name="level" list="levelList" onChange={e => changeField("level", e.currentTarget.value)} type="level" />
                    {allLevels &&
                      <datalist id="levelList">
                        {allLevels.map(singleLevel => {
                          return <option key={singleLevel.id} value={singleLevel.name}>{singleLevel.name}</option>
                        })}
                      </datalist>
                    }
                  </div>
                  <div id="no-level">Please give your subject an educational level</div>
                </div>

                {/* TAGS */}

                <div className="button-menu-container">
                  <div className="input-field">
                    <label>Tags:</label>
                    <input placeholder="Tags" value={tag} name="tags" list="tagsList" onChange={e => changeField("tags", e.currentTarget.value)} type="tags" />
                  </div>
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
                <div className="file-input-field">
                  <div className="form-inside-content" id="default">

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
                  <div className="file-input-warning">
                    <div id="max-tags-reached">Maximum of four tags. Please delete a tag before adding a new one</div>
                    <div id="no-tags">Please add at least one tag</div>
                    <div id="duplicate-tags">Tag already selected. Please select a different tag</div>
                  </div>
                </div>


              </div>

            </div>

            {/* IMAGE */}
            <div className="form-fields-notext">
              <div className="form-subfield">
                <div>
                  <h3>Profile Image</h3>
                  <p>This image will be used on the resource catalogue page.</p>
                </div>
                <div className="image-container">
                  <div>
                    <p>Profile Image</p>
                    <div className="catalogue-profile-image">
                      <img id="preview" src={require("../images/aioLogo.png")} alt="No Profile Image"></img>
                    </div >
                  </div>
                  <div>
                    <p>Profile Card Image</p>
                    <div className="catalogue-card-image">
                      <img id="preview-2" src={require("../images/aioLogo.png")} alt="No profile"></img>
                    </div>
                  </div>
                </div>
                <div className="input-container">
                  <div className="file-input-field">
                    <input className="custom-file-input" onChange={(e) => prepareProfileImage(e, ["preview", "preview-2"])} name="image" accept="image/*" id="image" type="file" />
                  </div>
                  <div id="no-image">Please upload an image.</div>
                </div>
              </div>
            </div>

            {/* DOWNLOADS */}
            <div className="form-fields-notext">
              <div className="form-subfield">
                <h3>Upload Resources</h3>
                <p>Your teaching resources can be uploaded here, click to upload one or more files. There is no limit on the number of files you can upload but the maximum file size cannot exceed 50mb.</p>
                <br></br>
                <p>Files to upload (Maximum total size 50mb):</p>
                <div className="file-input-field">
                  <div className="form-inside-content" id="default">
                    {resourceUploads.length > 0 ?
                      resourceUploads.map(file => (
                        <div className="added-item">
                          <label>{file.name}</label>
                          <button className="remove-file" onClick={(e) => removeFile(e, resourceUploads.indexOf(file))}>Remove File</button>
                        </div>
                      ))
                      :
                      <p>No files added</p>}
                  </div>
                  <div className="file-input-warning">
                    <div id="file-too-large"><p>File could not be added because the total size of all files attached would exceed 50mb.</p></div>
                    <div id="no-downloads"><p>Please add at least one file</p></div>
                    <div id="duplicate-files"><p>One or more of your files are already on the list of downloads. Remove the existing file first.</p>

                      <br></br>
                      <p>Duplicate files:</p>

                      <div className="form-inside-content" id="duplicates">
                        {duplicateFiles.map(file => {
                          return <div className="added-item"> <p>{file.name}</p> </div>
                        })
                        }
                      </div>
                    </div>
                  </div>

                </div>
                <div className="input-container">
                  <div className="file-input-field">
                    <input className="custom-file-input" onChange={(e) => { prepareAllFiles(e) }} type="file" id="download" name="download" multiple />
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="button" name="cancel" onClick={() => handleCancel()} value="Cancel">Cancel</button>
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