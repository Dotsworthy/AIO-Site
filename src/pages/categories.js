import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"

import CategoryList from "../components/categoryList"
import AddCategoryForm from "../components/addCategoryForm"

const CategoryPage = () => {

    return (
  
    
    <Layout>
      <h3>Categories Database</h3>
      <h3>List of Resources</h3>
      <CategoryList/>
      <h3>Add Resource</h3>
      <h2>Add Item</h2>
      <AddCategoryForm/>
      
      <Link to="/">Go back to the homepage</Link>
    </Layout>
    )
  }

export default CategoryPage;