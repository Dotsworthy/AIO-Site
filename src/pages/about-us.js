import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import downloadFile from "../images/All-In-One-Education-Our-Mission.pdf";

const AboutUs = () => {

    return (
        <Layout siteType={"client"}>
            <SEO title="About Us" />
            <div className="banner-container" id="about-us">
                {/* <img src={require("../images/79574096_m.jpg")}/> */}
            </div>
        
            <div className="content-box" id="pink">
                <h1>WE ARE:</h1>
                <div className="content-box-horizontal">

                    <div className="paragraph-box-horizontal" id="white">
                        <img src={require("../images/38079971_m.jpg")} alt="inclusive"></img>    
                        <h1>INCLUSIVE</h1>
                        <p>We believe that every child should be able to see themselves in their school books, and that every classroom experience should empower them to explore and engage meaningfully with the world they live in. We want to make the UK’s curriculums world-leading by enabling inclusive, intersectional history to be taught easily and effectively, greatly benefiting every young learners’ academic and social development.</p>
                    </div>

                    <div className="paragraph-box-horizontal" id="white">
                        <img src={require("../images/121432034_m.jpg")} alt="grassroots"></img>
                        <h1>GRASSROOTS</h1>    
                        <p>All of our teams work on a volunteer basis, and we are dedicated to being led from the bottom up, with educators at the forefront. Content is produced entirely by teachers working in the UK today, and in partnership with organisations with lived experience/expertise, to ensure that materials are appropriate, representative, and legitimate. </p>
                    </div>

                    <div className="paragraph-box-horizontal" id="white">
                        <img src={require("../images/54852849_m.jpg")} alt="accessible"></img>    
                        <h1>ACCESSIBLE</h1>
                        <p>All in One materials are not simply supplementary, and we do not seek to compete with existing curriculums; rather, All in One lessons are designed to enhance current topics so that they become more diverse, tangible, and engaging for all of our young learners. Resources are demarcated by year group, stage, and national curriculum, and can also be used more individually to enhance preparation for national examinations at every level.</p>
                    </div>

                    <div className="paragraph-box-horizontal" id="white">
                        <img src={require("../images/119580500_m.jpg")} alt="evolutionary"></img>  
                        <h1>EVOLUTIONARY</h1>
                        <p>We remain mindful of broadening horizons in Education services, technologies, and methods, and update content regularly to ensure continued ease of use and relevance. We employ a robust feedback loop of trialling, research, and case studies from teachers and classrooms in the UK right now to inform our development as an organisation and as a learning service.</p>
                    </div>

                    <div className="paragraph-box-horizontal" id="white">
                        <img src={require("../images/115668764_m.jpg")} alt="advocates"></img>  
                        <h1>ADVOCATES</h1>
                        <p>We recognise that education is vital for building exceptional global citizens and for alleviating social injustice. Our Campaigns team raises awareness of the important work of our partner organisations through events and marketing, and lobbies UK governments and educational institutions to include All in One as a recommended teaching aid in university and college PGCE/PDGE course syllabuses.</p>
                    </div>

                    <div className="paragraph-box-horizontal" id="white">
                        <p>Read our full mission statement to find out more:</p>    
                        <div className="link-box">
                            <a href={downloadFile}
                             target="_blank" 
                             rel="noreferrer"
                             download>Mission Statement</a>
                        </div>
                    </div>
                </div>
        
            </div>

            {/* Needs integration with Mailchimp */}
            {/* <div className="newsletter-banner">
                <div className="paragraph-box" id="white">
                <h1>SUBSCRIBE TO OUR NEWSLETTER</h1>
                <p>Sign up with your email address to receive news and updates.</p>
                <form className="client-form">
                <input placeholder="E-mail Address"/>
                <button>Sign Up</button>
                </form>
                </div>
            </div>  */}
           

        </Layout>
    )
    
}

export default AboutUs