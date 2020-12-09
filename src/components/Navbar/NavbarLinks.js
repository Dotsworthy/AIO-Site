import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const NavItem = styled(Link)`
  text-decoration: none;
  color: #eee;
  display: inline-block;
  white-space: nowrap;
  margin: 1vw 0;
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
    background: goldenrod;
    height: 1px;
    transition: all 0.4s ease-in;
  }

  :hover {
    color: goldenrod;
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

const NavbarLinks = ( siteType ) => {
  const site = String(siteType.siteType)
  console.log(site)
    return (
      <>
      { siteType.siteType == "client" && 
        <>
        <NavItem to="/about-us">About Us</NavItem>
        <NavItem to="/take-action">Take Action</NavItem>
        <NavItem to="/resources/">Resources</NavItem>
        <NavItem to="/contact-us">Contact Us</NavItem>
        <NavItem to="/admin/">Admin Login</NavItem>
        </>
      }
      { siteType.siteType == "admin" && 
      <>
      <Link to="/admin/subjectList">Subject List</Link>
      <Link to="/admin/categoryList">Categories</Link>
      <Link to="/admin/levelList">Levels</Link>
      <Link to="/admin/tagList">Tags</Link>
      </>
      }
      </>
    )
  }
  
  export default NavbarLinks