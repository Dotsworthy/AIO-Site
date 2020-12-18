import React, { useState } from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";
import DownloadHandler from "../components/downloadHandler";

// Move Download handler to resource catalogue.

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
            <div className="banner-container-desktop-only" id="yellow">
                    <div className="paragraph-box" id="white"><h1>RESOURCE CATALOGUE</h1></div>
            </div>

            <div>
            {/* <input type="text" id="myInput" onKeyUp="myFunction()" placeholder="Search for names.."/> */}
            <div>
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