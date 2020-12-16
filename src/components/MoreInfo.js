import React, { useState } from "react";
import DownloadHandler from "./downloadHandler";
import firebase from "firebase";
import 'firebase/storage';

const MoreInfo = ({ currentItem, setMoreInfo }) => {

    const [item, setItem] = useState(currentItem);
    const [downloading, setDownloading] = useState(false);

    const getImageURL = (id, location, resource) => {
        const image = `${location}/${id}/${resource.image}`
        const storageRef = firebase.storage().ref(image);
        storageRef.getDownloadURL().then(function(url) {
            
          const img = document.getElementById("output")
          img.src = url;
        }).catch(function(error) {
            console.log(error);
        })
      }

    return (
        <div className="database-form">
            <div className="form-header">
                <h2>{item.name}</h2>
                <button onClick={() => setMoreInfo(false)}>X</button>
            </div>

                <div className="form-container">
                <p>{item.description}</p>
                <div className="catalogue-image-container">
                <img className="catalogue-image" src={getImageURL(item.id, "images", item)} id={"output"} alt={item.name}></img>
                </div>
                </div>

                <div>
                    <h2>Downloads</h2>
                    <DownloadHandler currentItem={currentItem} setDownloading={setDownloading}/>
                </div>

            
        </div>
    )
}

export default MoreInfo