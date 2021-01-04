/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
// import { useStaticQuery, graphql } from "gatsby"

// import Header from "./header"
import Navbar from "./Navbar/Navbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'


import { Link } from "gatsby"
// import "./layout.css"
import "./stylesheets/styles.scss"


const Layout = ({ children, siteType }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)

  return (
    <>
      <Navbar siteType={siteType}/>
      {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
      <div className="site"
        style={{
          margin: `0 auto`,
          maxWidth: 1920,
          // position: 'relative',
          // minHeight: '100vh',
          // padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <div className="site-content"><main>{children}</main></div>
        
        <footer className="footer">
          {/* <div>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </div> */}
          <Link className="logo" to="/">All in One Education</Link>
          
          <div className="icons">
            <a className="icon-link" href="https://www.facebook.com/allinoneeducationuk">
              <FontAwesomeIcon icon={faFacebook} size="1x"/>
            </a>
            
            <a className="icon-link" href="https://twitter.com/aioeducation?lang=en">
              <FontAwesomeIcon icon={faTwitter} size="1x"/>
            </a>

            <a className="icon-link"  href="https://www.instagram.com/allinoneeducationuk/">
              <FontAwesomeIcon icon={faInstagram} size="1x"/>
            </a>

          </div>

          <div className="logo-container">
            <img className="logo" src={require("../images/OSCR.jpg")} alt="OSCR"></img>
            <img className="logo" src={require("../images/SVCO.png")} alt="SVCO"></img>

          </div>

          <Link className="logo" to="/contact-us">Contact Us</Link>
          
        </footer>
      </div>

      
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
