import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NewsPage = ({data}) => (
    <Layout siteType={"client"}>
        <SEO title="news"/>
        <div className="banner-container-2" id="red">
            <div className="paragraph-box" id="white"><h1>NEWS</h1></div>
            {/* <div className="paragraph-box" id="white"><p>Keep up with the latest from All in One Education</p></div> */}
        </div>
        {console.log(data.allBlogs.edges)}
        
    </Layout>
)

export const query = graphql`
query {
    allBlogs {
        edges {
            node {
                title
                sub_title
                author
                cover_img
                tags
                date
                timestamp
            }
        }
    }
}
`


export default NewsPage