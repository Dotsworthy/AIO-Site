import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'
import JSZip from "jszip";
import { saveAs } from 'file-saver';

const DownloadHandler = ({ currentItem, setDownloading }) => {

    const [resources] = useState(currentItem)

    const getDownload = (download, location) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        const httpsReference = storageRef.child(`${location}/${resources.id}/${download}`);
      
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

    const getAllDownloads = (location) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        let zip = new JSZip();
        let materials = zip.folder(`${resources.name}`)
        resources.download.forEach(resource => {
            const httpsReference = storageRef.child(`${location}/${resources.id}/${resource}`)
            
            httpsReference.getDownloadURL().then(function(url) {
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                console.log(xhr)
                xhr.onload = function(event) {
                    let blob = xhr.response;
                    materials.file(`${resource}`, blob)
                };
                xhr.open('GET', url)
                xhr.send();  
                }).catch(function(error) {
                    console.log(error)
                })   
        })
        console.log(zip)
        setTimeout(function() {
            zip.generateAsync({type:"blob"})
            .then(function (blob) {
                saveAs(blob, `${resources.name}`);
            })
        }, 3000)
    }  

    return (
        <div className="popup-container">
            <div className="form-header">
                <h2>Download Resources</h2>
            </div>
            <div className="downloads-container">
            {resources.download.map(resource => (
                <div key={resource} className="download-items">
                <p>{resource}</p>
                <button onClick={(e) => getDownload(resource, "downloads")}>Download</button>
                </div>
            ))}
            <div className="download-items">
                <p>Download All Files as Zip</p>
                <button onClick={(e) => getAllDownloads("downloads")}>Download</button>
            </div>
            </div>
            <div className="form-footer">
            <button onClick={()=>setDownloading(false)}>Close</button>
            </div>
        </div>
    )
}

export default DownloadHandler