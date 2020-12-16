import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import ResourceCatalogue from "./resourceCatalogue";

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

    const getAllDownloads = async (location) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        const download = document.getElementById("zip")
        download.value = "downloading..."
        let zip = new JSZip();
        let materials = zip.folder(`${item.name}`)
        
        let count = 0;


            // return new Promise((resolve, reject) => {
            //     const downloadTask = httpsReference.getDownloadURL().then(function(url) {
            //         let xhr = new XMLHttpRequest();
            //         xhr.responseType = 'blob';
            //         console.log(xhr);
            //         xhr.onload = function(event) {
            //             let blob = xhr.response;
            //             console.log(blob);
            //             materials.file(`${resource}, blob`)
                        
            //         };
            //         xhr.open('GET', url)
            //         xhr.send()
            //     }).then(function complete() {
            //         resolve(downloadTask);
            //         console.log("fired")
            //     })
            //     .catch(function(error) {
            //         console.log(error)
            //     })
            //     })
        
        // console.log(materials);
        
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
                count++
                console.log(count)
                }).catch(function(error) {
                    console.log(error)
                })   
        })
        // console.log(zip)

        if (count == item.download.length) {
            zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, `${item.name}`)
            download.value = "Download";
        })
        }

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