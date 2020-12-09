import React, { useState } from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";
import DownloadHandler from "../components/downloadHandler";


const ResourcePage = () => {

    const initialItemState = [
        { id: null, name: "", download: "" },
        ]

    const [downloading, setDownloading] = useState(false);
    const [currentItem, setCurrentItem] = useState(initialItemState)

    const downloadResource = item => {
        setDownloading(true);
        setCurrentItem({
            id: item.id,
            name: item.name,
            download: item.download
        })
    }

    return (
        <Layout siteType={"client"}>
            <div className="page-container">
            <h1>Resources</h1>
            {/* <input type="text" id="myInput" onKeyUp="myFunction()" placeholder="Search for names.."/> */}
            <div className="resource-page-container">
            <ResourceCatalogue downloadResource={downloadResource} />
            {downloading && <DownloadHandler
            currentItem={currentItem}
            setDownloading={setDownloading}
            />}
            </div>
            </div>
        </Layout>
    )
}

export default ResourcePage;