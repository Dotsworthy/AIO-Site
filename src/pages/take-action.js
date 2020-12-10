import React from "react";
import Layout from "../components/layout";

const TakeAction = () => {


    return (
        <Layout siteType={"client"}>
            <div className="banner-container" id="green">
                    <div className="paragraph-box" id="white"><h1>HOW CAN YOU GET INVOLVED WITH ALL IN ONE?</h1></div>
                    <div className="paragraph-box" id="white"> <p>Whether you’re a teacher or organisation with a great idea for a lesson or content, an educator who wants to trial our lessons in their classrooms, or a citizen wanting to see real change in the UK curriculum, here are some ways you can get involved with All in One:</p></div>
            </div>
            
            <div className="content-box" id="white">
                <div className="content-overlay-box">
                <img src={require("../images/42402515_m.jpg")}></img>
                <div className="paragraph-box paragraph-right" id="pink">
                    <h2>DONATE </h2>
                    <p>All In One Education is a voluntary organisation powered by collaboration, and donation. Support us via our gofundme page below - all donations go towards creating and maintaining the All in One learning platform, paying contributor fees, and running promotional events, and every penny makes a huge difference - so thank you!</p>
                    
                    <div className="link-box">
                    <a href="https://www.gofundme.com/f/all-in-one-education-a-reformative-resource">Donate</a>
                    </div>
                </div>
                    
                </div>

                <div className="content-overlay-box">
                <img className="img-right" src={require("../images/115668764_m.jpg")}></img>
                <div className="paragraph-box paragraph-left" id="yellow">
                    <h2>VOLUNTEER</h2> 
                        <p>Want to volunteer with us to create amazing content for All in One? Click below to join the collective!</p>
                        <div className="link-box">
                    <a href="mailto:enquiries@allinoneeducation.co.uk?subject=Volunteering with All In One">Volunteer</a>
                    </div>
                </div>
                   
                </div>
            </div>
            
        
        

        
        </Layout>
    )
}

export default TakeAction