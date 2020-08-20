import React from "react"
import { Link } from "gatsby"
import firebase from "../components/firebase"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => {
  firebase
  .firestore()
  .collection("items")
  .add({
    name: "Red Tails",
    image: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-469442375-1588101206.jpg?crop=1.00xw:0.948xh;0,0.0517xh&resize=640:*",
    resourceInfo: "This is an example learning resource",
    category: "history",
    level: "key stage one",
    tags: "tags"
  })
  .then(ref => {
    console.log("Added document with ID: ", ref.id)
  })

  return (

  
  <Layout>
    <SEO title="Page two" />
    <h1>Resource Database</h1>
    <h2>List of Resources</h2>
    <h2>Add Resource</h2>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
  )
}

export default SecondPage
