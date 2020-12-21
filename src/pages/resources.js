import React from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";


// Move Download handler to resource catalogue.

const ResourcePage = () => {

    return (
        <Layout siteType={"client"}>
            <div className="banner-container-desktop-only" id="dark-grey">
                    <div className="paragraph-box" id="white"><h1>RESOURCE CATALOGUE</h1></div>
            </div>

            <ResourceCatalogue/>

        </Layout>
    )
}

export default ResourcePage;