import React from "react";
import Layout from "../components/layout";
import emailjs from "emailjs-com";

const ContactUs = () => {

    const handleSubmit = e => {
        e.preventDefault()
        const button = document.getElementById('button')
        const form = document.getElementById('form')

        const confirm = document.getElementById('confirm')
        const error = document.getElementById('error')

        const serviceID = 'default_service';
        const templateID = 'template_qrrr8tp';
        const userID = 'user_Qbuw599Yamda7QR3LTIuO';

        button.value = 'Sending...'

        emailjs.sendForm(serviceID, templateID, form, userID)
            .then(() => {
                confirm.style.display = "block";
                button.style.display = "none";
            }, (err) => {
                error.style.display = "block";
                button.style.display = "none";
            });
    }

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
            <form id="form" onSubmit={handleSubmit} className="contact-us-form">
                <input type="text" name="first_name" placeholder="First Name"/>
                <input type="text" name="last_name" placeholder = "Last Name"/>
                <input type="text" name="reply_to" placeholder = "Email"/>
                <textarea type="text" name="message" placeholder = "Message"/>
                <div id="confirm"><p>Thanks! We will reply to your enquiry ASAP.</p></div>
                <div id="error"><p>Oh No! It appears there was an error. Please try emailing us directly at enquiries@allinoneeducation.co.uk.</p></div>
                <input type="submit" id="button" value="Send Email"/>
            </form>
            </div>
            
            </div>
            
        </Layout>
    )
}

export default ContactUs