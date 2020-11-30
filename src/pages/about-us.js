import React from "react";
import Layout from "../components/layout";

const AboutUs = () => {

    return (
        <Layout>
        <h1>ABOUT US</h1>

        <h1>WE ARE:</h1>

        <div>
        <h1>INCLUSIVE</h1>
        <p>We believe that every child should be able to see themselves in their school books, and that every classroom experience should empower them to explore and engage meaningfully with the world they live in. We want to make the UK’s curriculums world-leading by enabling inclusive, intersectional history to be taught easily and effectively, greatly benefiting every young learners’ academic and social development.</p>
        </div>

        <div>
        <h1>GRASSROOTS</h1>    
        <p>All of our teams work on a volunteer basis, and we are dedicated to being led from the bottom up, with educators at the forefront. Content is produced entirely by teachers working in the UK today, and in partnership with organisations with lived experience/expertise, to ensure that materials are appropriate, representative, and legitimate. </p>
        </div>

        <div>
        <h1>ACCESSIBLE</h1>
        <p>All in One materials are not simply supplementary, and we do not seek to compete with existing curriculums; rather, All in One lessons are designed to enhance current topics so that they become more diverse, tangible, and engaging for all of our young learners. Resources are demarcated by year group, stage, and national curriculum, and can also be used more individually to enhance preparation for national examinations at every level.</p>
        </div>

        <div>
        <h1>EVOLUTIONARY</h1>
        <p>We remain mindful of broadening horizons in Education services, technologies, and methods, and update content regularly to ensure continued ease of use and relevance. We employ a robust feedback loop of trialling, research, and case studies from teachers and classrooms in the UK right now to inform our development as an organisation and as a learning service.</p>
        </div>

        <div>
        <h1>ADVOCATES</h1>
        <p>We recognise that education is vital for building exceptional global citizens and for alleviating social injustice. Our Campaigns team raises awareness of the important work of our partner organisations through events and marketing, and lobbies UK governments and educational institutions to include All in One as a recommended teaching aid in university and college PGCE/PDGE course syllabuses.</p>
        </div>

        <div>
        <p>Read our full mission statement to find out more:</p>    
        <a href="./public/All-In-One-Education-Our-Mission.pdf" target="_blank" download>Mission Statement</a>
        </div>

        <div>
        <h2>SUBSCRIBE TO OUR NEWSLETTER</h2>
        <p>Sign up with your email address to receive news and updates.</p>
        <form>
        <input placeholder="E-mail Address"/>
        <button>Sign Up</button>
        </form>

        </div>
        </Layout>
    )
    
}

export default AboutUs