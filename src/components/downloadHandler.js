import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'
import JSZip from "jszip";
import { saveAs } from 'file-saver';

// Get all downloads needs to be converted to a promise in order to wait for large downloads.

const DownloadHandler = ({ currentItem, setDownloading }) => {

    const [item] = useState(currentItem)

    const getDownload = (download, location) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        const httpsReference = storageRef.child(`${location}/${item.id}/${download}`);
      
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
        const download = document.getElementById("zip")
        download.value = "downloading..."
        let zip = new JSZip();
        let materials = zip.folder(`${item.name}`)
        item.download.forEach(resource => {
            const httpsReference = storageRef.child(`${location}/${item.id}/${resource}`)
            
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
                saveAs(blob, `${item.name}`);
            })
            download.value = "Download";
        }, 4000)

        
    }  

    return (
        <div>
            <div
             className="downloads-container"
             >
            {item.download.map(resource => (
                <div key={resource} className="download-items">
                <p>{resource}</p>
                <input id={resource.name} value="Download" onClick={(e) => getDownload(resource, "downloads")}/>
                </div>
            ))}
            <div className="download-items">
                <p>Download All Files as Zip</p>
                <input type="button" value="Download" id="zip" onClick={(e) => getAllDownloads("downloads")}/>
            </div>
            </div>
            {/* <div className="form-footer">
            <button onClick={()=>setDownloading(false)}>Close</button>
            </div> */}
        </div>
    )
}

export default DownloadHandler