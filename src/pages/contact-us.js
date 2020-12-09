import React from "react";
import Layout from "../components/layout";

const ContactUs = () => {

    return (
        <Layout siteType={"client"}>
            <h1>CONTACT US</h1>
            <p>Contact us to learn more about our mission and work, or get involved yourself.</p>
            <p>enquiries@allinoneeducation.co.uk</p>

            <form>
                <input placeholder="First Name"/>
                <input placeholder = "Last Name"/>
                <input placeholder = "Email"/>
                <input placeholder = "Message"/>
                <button>Send</button>
            </form>
        </Layout>
    )
}

export default ContactUs