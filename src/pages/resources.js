import React, { useState } from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";


// Move Download handler to resource catalogue.

const ResourcePage = () => {

    const initialItemState = [
        { id: null, name: "", download: "" },
        ]

    
    const [currentItem, setCurrentItem] = useState(initialItemState)

    

    return (
        <Layout siteType={"client"}>
            <div className="banner-container-desktop-only" id="dark-grey">
                    <div className="paragraph-box" id="white"><h1>RESOURCE CATALOGUE</h1></div>
            </div>

            <div>
            {/* <input type="text" id="myInput" onKeyUp="myFunction()" placeholder="Search for names.."/> */}
            <div>
            <ResourceCatalogue/>
            
            </div>
            </div>
        </Layout>
    )
}

export default ResourcePage;