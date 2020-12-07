import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Header = ({ siteTitle }) => (

  <header>
    <nav className="nav-bar">

      {/* <Link className="logo" to="/">{siteTitle}</Link>
        <Link className="nav-links" to="/about-us">About Us</Link>
        <Link className="nav-links" to="/take-action">Take Action</Link>
        <Link className="nav-links" to="/resources/">Resources</Link>
        <Link className="nav-links" to="/contact-us">Contact Us</Link>
        <Link className="nav-links" to="/admin/">Admin</Link> */}
      
    </nav>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
