import React from "react"
import ResourceCatalogue from "../components/resourceCatalogue"
import Layout from "../components/layout";

// TODO: wait for resourceCatalogue to mount before rendering.

const ResourcePage = () => {

    return (
        <Layout siteType={"client"}>
            <ResourceCatalogue />
        </Layout>
    )
}

export default ResourcePage;