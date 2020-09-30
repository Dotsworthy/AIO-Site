import React, { useState, useEffect } from "react";
import firebase from "firebase"
import 'firebase/storage'

const DownloadHandler = ({ currentItem, setDownloading }) => {

    const [resources, setResources] = useState(currentItem)

    return (
        <div className="database-form-container">
            <div className="form-header">
                <h2>Download Resources</h2>
            </div>
            <div className="downloads-container">
            {resources.download.map(resource => (
                <div key={resource} className="download-items">
                <p>{resource}</p>
                <button>Download</button>
                </div>
            ))}
            </div>
            <button onClick={()=>setDownloading(false)}>Close</button>
        </div>
    )
}

export default DownloadHandler