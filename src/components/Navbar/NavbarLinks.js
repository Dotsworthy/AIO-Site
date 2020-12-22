import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'


const NavItem = styled(Link)`
  text-decoration: none;
  color: #eee;
  display: inline-block;
  white-space: nowrap;
  margin: 10px 0;
  position: relative;

  :after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 0%;
    content: ".";
    color: transparent;
    background: #F2B749;
    height: 1px;
    transition: all 0.4s ease-in;
  }

  :hover {
    color: #F2B749;
    ::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0;
    font-size: 1.5rem;
    z-index: 6;
  }
`

const NavbarLinks = ( siteType, setNavbarOpen ) => {

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  },[])

  if (!hasMounted) {
    return <>
    </>
  }


  return (
      <>
      { siteType.siteType === "client" && 
        <>
        <Link className="navbar-link" to="/about-us">About Us</Link>
        <Link className="navbar-link" to="/take-action">Take Action</Link>
        <Link className="navbar-link" to="/resources/">Resources</Link>
        <Link className="navbar-link" to="/contact-us">Contact Us</Link>
        <Link className="navbar-link" id="admin-login" to="/admin/">Admin Login</Link>
        </>
      }
      { siteType.siteType === "admin" && 
      <>
      <Link className="navbar-link" to="/admin/subjectList">Subject List</Link>
      <Link className="navbar-link" to="/admin/categoryList">Categories</Link>
      <Link className="navbar-link" to="/admin/levelList">Levels</Link>
      <Link className="navbar-link" to="/admin/tagList">Tags</Link>
      </>
      }
      <div className="icons-navlinks">
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
      </>
    )
  }
  
  export default NavbarLinks