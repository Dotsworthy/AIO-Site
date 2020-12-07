import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Header = ({ siteTitle }) => (

  <header>
    <nav className="nav-bar">
      <span className="navbar-toggle" id="js-navbar-toggle">
      <FontAwesomeIcon icon={faBars} class="fas fa-bars" size="1x"/>
      </span>

      <Link className="logo" to="/">{siteTitle}</Link>
      <ul class="nav-main" id="js-menu">
        <li><Link className="nav-links" to="/about-us">About Us</Link></li>
        <li><Link className="nav-links" to="/take-action">Take Action</Link></li>
        <li><Link className="nav-links" to="/resources/">Resources</Link> </li>
        <li><Link className="nav-links" to="/contact-us">Contact Us</Link> </li>
        <li><Link className="nav-links" to="/admin/">Admin</Link></li>
      </ul>
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
