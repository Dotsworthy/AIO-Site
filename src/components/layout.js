/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Navbar from "./Navbar/Navbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

import { Link } from "gatsby"
import "./stylesheets/styles.scss"
import "./stylesheets/navbar.scss"
import "./stylesheets/admin.scss"
import "./stylesheets/frontend.scss"


const Layout = ({ children, siteType }) => {

  return (
    <>
      <header>
      <Navbar siteType={siteType} />
      </header>
    
      <div className="site"
        style={{
          margin: `0 auto`,
          maxWidth: 1920,
        }}
      >
        <div className="site-content"><main>{children}</main></div>

        <footer className="footer">
          <Link className="logo" to="/">All in One Education</Link>

          <div className="icons">
            <a className="icon-link" href="https://www.facebook.com/allinoneeducationuk">
              <FontAwesomeIcon icon={faFacebook} size="1x" />
            </a>

            <a className="icon-link" href="https://twitter.com/aioeducation?lang=en">
              <FontAwesomeIcon icon={faTwitter} size="1x" />
            </a>

            <a className="icon-link" href="https://www.instagram.com/allinoneeducationuk/">
              <FontAwesomeIcon icon={faInstagram} size="1x" />
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
