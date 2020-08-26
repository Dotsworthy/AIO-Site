import React from "react"
import ItemCatalogue from "../components/itemCatalogue"
import Layout from "../components/layout";
import { Link } from "gatsby";


const ResourcePage = () => {
    return (
        <Layout>
            <ItemCatalogue/>
            <Link to="/">Go back to the homepage</Link>
        </Layout>
    )
}

export default ResourcePage;