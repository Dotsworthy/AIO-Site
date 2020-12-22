import React, { useEffect, useState } from "react"
import NavbarLinks from "./NavbarLinks"
import { Link } from "gatsby"
// import Logo from "./Logo"
import styled from 'styled-components'

const Hamburger = styled.div`
  background-color: #eee;
  width: 30px;
  height: 3px;
  transition: all .3s linear;
  align-self: center;
  position: fixed;
  margin: 3px;
  top: 47px;
  right: 3%;
  transform: ${props => (props.open ? "rotate(-45deg)" : "inherit")};

  ::before,
  ::after {
    width: 30px;
    height: 3px;
    background-color: #eee;
    content: "";
    position: absolute;
    transition: all 0.3s linear;
  }

  ::before {
    transform: ${props =>
      props.open ? "rotate(-90deg) translate(-10px, 0px)" : "rotate(0deg)"};
    top: -10px;
  }

  ::after {
    opacity: ${props => (props.open ? "0" : "1")};
    transform: ${props => (props.open ? "rotate(90deg) " : "rotate(0deg)")};
    top: 10px;
  }
`

const Navbar = ( siteType ) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const site = String(siteType.siteType);
  // const body = document.getElementsByTagName("BODY")[0];

  useEffect(() => {

    setHasMounted(true);
    document.body.style.overflow = "auto"
  },[])

  // if (!hasMounted) {
  //   return (
  //     <div className="banner-renderer">
  //       <Link to="/">All In One</Link>
  //     </div>
  //   )
  // }

  const triggerNavbar = () => {
    if (navbarOpen === true) {
      setNavbarOpen(false)
      document.body.style.overflow = "auto"
    } else if (navbarOpen === false) {
      setNavbarOpen(true)
      document.body.style.overflow = "hidden"
    }
  }
  // if (navbarOpen === true) {
  //   body.style.overflow = "hidden"
  // } else if (navbarOpen === false) {
  //   body.style.overflow = "auto"
  // }

  return (
    <nav className="navigation" id={ site === "client" ? "blue" : "red"}>
      <Link className="home-link" to="/">All In One</Link>
      <div className="toggle"
        navbarOpen={navbarOpen}
        onClick={() => triggerNavbar()}
      >
        {navbarOpen ? 
        <div className="burger-container"id="burger-open">
          <div className="slice1" id="slice1"/>
            <div className="slice2" id="slice2"/>
            <div className="slice3" id="slice3"/>
        </div> 
        : <div className="burger-container" id="burger-closed">
            <div className="slice1"/>
            <div className="slice2"/>
            <div className="slice3"/>
          </div>
          }
      </div>
      {navbarOpen ? (
        <div className="navbox" id="open">
          <NavbarLinks siteType={ site } setNavbarOpen={setNavbarOpen}/>
        </div>
      ) : (
        <div className="navbox" id="closed">
          <NavbarLinks siteType = { site } setNavbarOpen={setNavbarOpen}/>
        </div>
      )}
    </nav>
  )
}

export default Navbar