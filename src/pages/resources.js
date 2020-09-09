import React from "react"
import ItemCatalogue from "../components/itemCatalogue"
import SearchList from "../components/searchList"
import Layout from "../components/layout";
import { Link } from "gatsby";


const ResourcePage = () => {
    return (
        <Layout>
            <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names.."/>
            <div className="resource-page-container">
            <SearchList/>
            <ItemCatalogue resource={"items"}/>
            </div>
            <Link to="/">Go back to the homepage</Link>
        </Layout>
    )
}

export default ResourcePage;