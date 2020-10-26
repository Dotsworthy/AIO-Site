import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header>
    <div className="header-container">
        <div className="header-title">
        <Link className="link-title" to="/">{siteTitle}</Link>
        </div>

        <div className="header-links">
        <Link to="/about-us">About Us</Link>
        <Link to="/take-action">Take Action</Link>
        <Link className="header-link" to="/resources/">Resources</Link>
        <Link to="/contact-us">Contact Us</Link>
        <Link className="header-link" to="/admin/">Admin Login</Link>
        </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
