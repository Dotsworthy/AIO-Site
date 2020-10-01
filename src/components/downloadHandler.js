import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const DownloadHandler = ({ currentItem, setDownloading }) => {

    const [resources, setResources] = useState(currentItem)

    const getDownload = (download) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        const httpsReference = storageRef.child(download);
      
        httpsReference.getDownloadURL().then(function(url) {
          let xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
          let a = document.createElement('a');
              a.href = window.URL.createObjectURL(xhr.response);
              a.download = `${download}`;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();   
          };
          xhr.open('GET', url);
          xhr.send();
        }).catch(function(error) {
          console.log(error);
        });
      }

    return (
        <div className="database-form-container">
            <div className="form-header">
                <h2>Download Resources</h2>
            </div>
            <div className="downloads-container">
            {resources.download.map(resource => (
                <div key={resource} className="download-items">
                <p>{resource}</p>
                <button onClick={(e) => getDownload(resource)}>Download</button>
                </div>
            ))}
            </div>
            <button onClick={()=>setDownloading(false)}>Close</button>
        </div>
    )
}

export default DownloadHandler