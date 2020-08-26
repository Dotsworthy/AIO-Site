import React from "react"
import { Link } from "gatsby"
import firebase from "../components/firebase"
import ItemList from "../components/itemList"
import AddItemForm from "../components/addItemForm"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => {

  return (

  <Layout>
    <SEO title="Page two" />
    <h3>Resource Database</h3>
    <h3>List of Resources</h3>
    <ItemList/>
    <h3>Add Resource</h3>
    <AddItemForm/>
    <Link to="/">Go back to the homepage</Link>
    <Link to="/categories">Categories</Link>
  </Layout>
  )
}

export default SecondPage
