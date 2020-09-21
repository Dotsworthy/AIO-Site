import React from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";
import { Link } from "gatsby";


const ResourcePage = () => {

    return (
        <Layout>
            {/* <input type="text" id="myInput" onKeyUp="myFunction()" placeholder="Search for names.."/> */}
            <div className="resource-page-container">
            <ResourceCatalogue/>
            </div>
            <Link to="/">Go back to the homepage</Link>
        </Layout>
    )
}

export default ResourcePage;