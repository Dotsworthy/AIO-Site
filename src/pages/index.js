import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"
import Img from "gatsby-image"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="content-container">
    <Image className="index-image"/>
    <div className="content-tag"> 
    
    <h1>EDUCATION DONE - ALL IN ONE.</h1>
    <h1>THE HISTORY OF BRITAIN IS COMPLEX AND DIVERSE - AND OUR EDUCATION SYSTEM SHOULD REFLECT THIS.</h1>
    </div> 

    <p>Our mission is to encourage and enhance intersectional learning in UK classrooms, exploring a range of viewpoints on our shared past through the provision of premade, easy to use lesson plans, discussion materials, homework suggestions, and teaching aids for educators of all stages and faculties.</p> 
      
    <p>Whether you’re covering the Tudors, WW1, Ancient Civilisations, or the 21st century, our lessons consider BIPOC, Female, LGBTQIA+, differently abled, colonial, environmental and other perspectives as a matter of course, enabling you to teach the intersectional realities of British Social Studies more effectively within our nations’ curriculums today.</p>
    </div>
  </Layout>
)

export default IndexPage
