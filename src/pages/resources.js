import React from "react"
import ItemCatalogue from "../components/itemCatalogue"
import SearchList from "../components/searchList"
import Layout from "../components/layout";
import { Link } from "gatsby";
import firebase from "../components/firebase"

const database = firebase;

const ResourcePage = () => {
    return (
        <Layout>
            <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names.."/>
            <div className="resource-page-container">
            <SearchList/>
            <ItemCatalogue db={database} resource={"items"}/>
            </div>
            <Link to="/">Go back to the homepage</Link>
        </Layout>
    )
}

export default ResourcePage;