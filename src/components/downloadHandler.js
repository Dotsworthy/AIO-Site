import React, { useState } from "react";
import firebase from "firebase"
import 'firebase/storage'
import JSZip from "jszip";
import { saveAs } from 'file-saver';

// NOTE: large file sizes are sizable and cause problems. Maybe look at bandwidth with free plan.

const DownloadHandler = ({ currentItem, setDownloading, setMoreInfo }) => {

    const [item] = useState(currentItem)

    const getDownload = (download, location) => {
        const storage = firebase.storage();
        const storageRef = storage.ref()
        const httpsReference = storageRef.child(`${location}/${item.id}/${download}`);

        httpsReference.getDownloadURL().then(function (url) {
            console.log("code-reached")
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = `${download}`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            };
            xhr.open('GET', url);
            xhr.send();
            console.log("code-reached")
        }).catch(function (error) {
            console.log(error);
        });
    }

    const fileDownloader = async (fileList) => {
        let zip = new JSZip();
        let materials = zip.folder(`${item.name}`)
        console.log("code-reached")
        await Promise.all(fileList.map(file => {
            return new Promise(function (resolve, reject) {
                const storageRef = firebase.storage().ref(`downloads/${item.id}/${file}`)
                storageRef.getDownloadURL().then(function (url) {
                    console.log("code-reached")
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.open('GET', url);
                    xhr.onreadystatechange = function (event) {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                console.log("code-reached")
                                let blob = xhr.response
                                materials.file(`${file}`, blob)
                                console.log(materials);
                                resolve(xhr.response)

                            } else {
                                reject(new Error("error"))
                            }
                        }

                    };
                    xhr.send();
                })
            })
        }))
            .then(function () {
                console.log(zip)
                setTimeout(function () {
                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                        saveAs(blob, `${item.name}`)
                    })
                }, 0)

            })
    }

    const getAllDownloads = async () => {
        const download = document.getElementById("zip")
        download.value = "downloading..."

        const fileList = Array.from(item.download);
        await fileDownloader(fileList)

        download.value = "Download";
    }

    return (
        <div>
            <div>
                {item.download.length > 0 ?
                    <>
                        {item.download.map(resource => (
                            <div key={resource} className="download-items">
                                <p>{resource}</p>
                                <input type="button" id={resource.name} value="Download" onClick={(e) => getDownload(resource, "downloads")} />
                            </div>
                        ))}
                        <div className="download-items">
                            <p>Download All Files as Zip</p>
                            <input type="button" value="Download" id="zip" onClick={(e) => getAllDownloads(e)} />
                        </div>

                    </>
                    :
                    <><div>No Downloads Available</div></>
                }

            </div>
        </div>
    )
}

export default DownloadHandler