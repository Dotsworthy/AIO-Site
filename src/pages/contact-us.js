import React from "react";
import Layout from "../components/layout";

const ContactUs = () => {

    return (
        <Layout siteType={"client"}>
            <div className="banner-container-2" id="pink">
                <div className="paragraph-box" id="white">
                    <h1>CONTACT US</h1>
                </div>
            </div>
            
            <div className="content-box-variable">
            
            <div className="paragraph-box box1" id="white">
            <p>Contact us to learn more about our mission and work, or get involved yourself.</p>
            <p>enquiries@allinoneeducation.co.uk</p>
            <img src={require("../images/42401748_m.jpg")}></img>
            
            
            
            </div>
            <div className="paragraph-box box2" id="white">
            <form className="contact-us-form">
                <input placeholder="First Name"/>
                <input placeholder = "Last Name"/>
                <input placeholder = "Email"/>
                <textarea placeholder = "Message"/>
                <button>Send</button>
            </form>
            </div>
            
            </div>
            
        </Layout>
    )
}

export default ContactUs