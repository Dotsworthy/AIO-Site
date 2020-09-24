import React from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";


const ResourcePage = () => {

    return (
        <Layout>
            {/* <input type="text" id="myInput" onKeyUp="myFunction()" placeholder="Search for names.."/> */}
            <div className="resource-page-container">
            <ResourceCatalogue/>
            </div>
        </Layout>
    )
}

export default ResourcePage;