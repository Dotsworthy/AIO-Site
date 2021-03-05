import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import downloadFile from "../images/All-In-One-Education-Our-Mission.pdf";

const AboutUs = () => {
    const triggerProfile = (pictureID, paragraphID) => {
        const picture = document.getElementById(pictureID)
        const paragraph = document.getElementById(paragraphID)

        if (picture.style.visibility === "hidden") {
            picture.style.opacity = "1";
            picture.style.visibility = "visible";
            picture.style.height = "100%";
            picture.style.width = "100%";

            paragraph.style.opacity = "0";
            paragraph.style.visibility = "hidden";
            
        } else {
            picture.style.opacity = "0";
            picture.style.visibility = "hidden";
            picture.style.height = "0%";
            picture.style.width = "0%";
            
            paragraph.style.opacity = "1";
            paragraph.style.visibility = "visible";
            
        }
    }

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
            <div className="content-box" id="blue">
                <h1>MEET US:</h1>
                <div className="content-box-horizontal">
                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-1", "employee-1")} 
                        onMouseLeave={() => triggerProfile("img-1", "employee-1")}
                    >
                        <h2>Anna Ploszajski Mayhew - Chair</h2>
                        <img className="employee-picture" src={require("../images/anna-mayhew.jpg")} alt="inclusive" id="img-1"></img>
                        <div className="employee-blurb" id="employee-1">
                        <p>Anna has a background in heritage learning, working for some of Scotland's biggest heritage organisations, including Historic Environment Scotland, and the National Galleries of Scotland. She currently coordinates the regional delivery of public music, arts, and heritage programmes across Falkirk, and oversees AIO’s strategic plan and mission as Chair of the Board. When not dreaming up new ways to get people excited about History, she is playing traditional music, losing at board games, and tending to her massive guinea pig, Angus.</p>
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p>
                        </div>
                    </div>
                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-2", "employee-2")} 
                        onMouseLeave={() => triggerProfile("img-2", "employee-2")}
                    >
                        <h2>Zo Daniels - Vice Chair</h2>
                        <img className="employee-picture" src={require("../images/zo-daniels.png")} alt="inclusive" id="img-2"></img>
                        <div className="employee-blurb" id="employee-2">
                        <p >Zo is a jack of all trades who has worked in various events and marketing roles in education and entertainment charities around London. An intersectional activist, and founding member of social activism group Collective Action For Black Matters, she has a thirst for knowledge and loves creating engaging and inspiring content. As AIO’s vice-chair, she directs strategy and oversees operations in England, and when she’s not working, you’ll probably find her hiding in a cinema somewhere. 
                        </p>
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p>                    
                        </div>
                        </div>
                    
                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-3", "employee-3")} 
                        onMouseLeave={() => triggerProfile("img-3", "employee-3")}
                    >
                        <h2>Gina Lorenzetti - Treasurer</h2>
                        <img className="employee-picture" src={require("../images/gina-lorenzetti.png")} alt="inclusive" id="img-3"></img>
                        <p className="employee-blurb" id="employee-3">Gina is an employee of AIO</p>                    
                    </div>

                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-4", "employee-4")} 
                        onMouseLeave={() => triggerProfile("img-4", "employee-4")}
                    >
                        <h2>Nikhat Yusaf - Teaching Lead</h2>
                        <img className="employee-picture" src={require("../images/nikhat-yusef.png")} alt="inclusive" id="img-4"></img>
                        <div className="employee-blurb" id="employee-4">
                        <p>Nikhat has a background in primary education and worked as a class teacher before taking on additional training to specialise in supporting bilingual learners and learners with literacy difficulties and dyslexia. When not developing and delivering training to teachers, supporting pupils with additional support needs and being an equalities champion at the Educational Institute of Scotland, she is a serial 'hobbyist', parent of four amazing young people and bird-mum to a demanding wee cockatiel, Momo. As AIO’s Teaching Lead, she coordinates our team of teacher creators and oversees our education strategy.</p>                    
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p> 
                        </div>
                    </div>

                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-5", "employee-5")} 
                        onMouseLeave={() => triggerProfile("img-5", "employee-5")}
                    >
                        <h2>Henry Lampitt - Relationships and Advocacy Lead</h2>
                        <img className="employee-picture" src={require("../images/henry-lampitt.png")} alt="inclusive" id="img-5"></img>
                        <div className="employee-blurb" id="employee-5">
                        <p>Henry has a background working in heritage education across the south east of England, both as an education officer and as a volunteer coordinator. As Relationships Lead, he forges bonds with our partner organisations, and works to create our education resources with AIO’s designers. If he's not spreading the word of All In One Education, you'll find him on his bike, off to find the next best place to eat or drink, or cooking at home for his friends and family.</p>
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p> 
                        </div>
                    </div>

                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-6", "employee-6")} 
                        onMouseLeave={() => triggerProfile("img-6", "employee-6")}
                    >
                        <h2>Christine Pont - Development Lead</h2>
                        <img className="employee-picture" src={require("../images/christine-pont.png")} alt="inclusive" id="img-6"></img>
                        <div className="employee-blurb" id="employee-6">
                        <p>Christine is AIO’s Business Development Lead, and has a background in museum education and various roles in the charity sector including fundraising and volunteer management. When she isn’t developing AIO into an exciting, accessible organisation, she spends most of her time trying to tame her toddler - but gets the odd opportunity to hide in a corner with a book or escape to her favourite routes to try and beat her 10k PB.</p>
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p> 
                        </div>
                    </div>
                    
                    <div className="profile-box" id="white"
                        onMouseEnter={() => triggerProfile("img-7", "employee-7")} 
                        onMouseLeave={() => triggerProfile("img-7", "employee-7")}
                    >
                        <h2>Lizzie Riungu - Advocacy Lead</h2>
                        <img className="employee-picture" src={require("../images/lizzie-riungu.png")} alt="inclusive" id="img-7"></img>
                        <div className="employee-blurb" id="employee-7">
                        <p>Lizzie has a background in social activism and events management, and is one of the co-founders of the Edinburgh in Solidarity with BLM activist group. She works in All In One’s Advocacy team, creating campaigns, content, and connections with educational institutes and social activism groups. Outwith this work, she is usually found walking her dog, playing board games, or learning how to make clothes.</p>
                        <br></br>
                        <p>To contact please email enquiries@allinoneeducation.co.uk</p>
                        </div> 
                    </div>

                </div>
            </div>

            {/* Needs integration with Mailchimp */}
            {/* <div className="newsletter-banner">
                <div className="paragraph-box" id="white">
                <h2>SUBSCRIBE TO OUR NEWSLETTER</h2>
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