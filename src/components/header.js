import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header>
    <div className="navigation-bar-container">
        <Link to="/">{siteTitle}</Link>
        <Link className="header-link" to="/admin/">Admin Page</Link>
        <Link className="header-link" to="/resources/">Resources</Link>
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
