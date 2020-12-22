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
  transition: all 200ms ease-in;
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
    padding: 3vh 0;
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
        <NavItem to="/about-us">About Us</NavItem>
        <NavItem to="/take-action">Take Action</NavItem>
        <NavItem to="/resources/">Resources</NavItem>
        <NavItem to="/contact-us">Contact Us</NavItem>
        <NavItem id="admin-login" to="/admin/">Admin Login</NavItem>
        </>
      }
      { siteType.siteType === "admin" && 
      <>
      <NavItem to="/admin/subjectList">Subject List</NavItem>
      <NavItem to="/admin/categoryList">Categories</NavItem>
      <NavItem to="/admin/levelList">Levels</NavItem>
      <NavItem to="/admin/tagList">Tags</NavItem>
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