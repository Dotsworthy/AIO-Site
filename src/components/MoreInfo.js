import React, { useState } from "react";
import DownloadHandler from "./downloadHandler";
import firebase from "firebase";
import 'firebase/storage';

const MoreInfo = ({ currentItem, setDownloading, setMoreInfo }) => {

    const [item] = useState(currentItem);

    const getImageURL = (id, location, resource) => {
        const image = `${location}/${id}/${resource.image}`
        const storageRef = firebase.storage().ref(image);
        storageRef.getDownloadURL().then(function(url) {
            
          const img = document.getElementById("more-info-image")
          img.src = url;
        }).catch(function(error) {
            console.log(error);
        })
      }

    return (
        <div className="catalogue-moreInfo" id="white">
            
            {/* <div className="more-info-item-header"> */}
                
                
            {/* </div> */}
                <div className="more-info-content">
                <div className="more-info-image-container">
                <img className="preview-image" src={getImageURL(item.id, "images", item)} id={"more-info-image"} alt={item.name}></img>
                </div>
                <div className="catalogue-description">
                <div className="catalogue-header">
                <h2>{item.name}</h2>
                  <button className="mobile-button" onClick={() => setMoreInfo(false)}>X</button>
                  
                </div>
                <p>{item.description}</p>
                <DownloadHandler currentItem={currentItem} setDownloading={setDownloading} setMoreInfo={setMoreInfo}/>
                </div>  
                </div>

                
                
               

                 
                    
                {/* </div> */}
                </div>
            
        
    )
}

export default MoreInfo