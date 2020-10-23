import React from "react"
import UpdateItem from "../components/additemform"
import Layout from "../components/layout"

const updateSubject = ({currentItem}) => {

    return (
        <Layout>
            <UpdateItem currentItem ={currentItem}/>
        </Layout>
    )
}

export default updateSubject
