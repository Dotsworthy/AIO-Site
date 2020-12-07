import React from "react"
import { Link } from "gatsby"

const NavbarLinks = () => {
    return (
      <div>
        <Link className="logo" to="/">{siteTitle}</Link>
        <Link className="nav-links" to="/about-us">About Us</Link>
        <Link className="nav-links" to="/take-action">Take Action</Link>
        <Link className="nav-links" to="/resources/">Resources</Link>
        <Link className="nav-links" to="/contact-us">Contact Us</Link>
        <Link className="nav-links" to="/admin/">Admin</Link>
      </div>
    )
  }
  
  export default NavbarLinks