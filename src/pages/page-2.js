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
    <h1>Resource Database</h1>
    <h2>List of Resources</h2>
    <h2>Add Resource</h2>
    <ItemList/>
    <h2>Add Item</h2>
    <AddItemForm/>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
  )
}

export default SecondPage
