import React, { useEffect, useState } from "react"
import NavbarLinks from "./NavbarLinks"
import { Link } from "gatsby"
// import Logo from "./Logo"
import styled from 'styled-components'

const Home = styled(Link)`
text-decoration: none;
color: #eee;
margin: 10px 0;
position: relative;
font-size: 3rem;

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
  color: goldenrod;
  ::after {
    width: 100%;
  }
}

@media (max-width: 768px) {
  font-size: 2rem;
  z-index: 6;
  position: relative;
}
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  min-height: 100px;
  position: relative;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  border-bottom: 2px solid #33333320;
  margin: 0 auto;
  padding: 0 2vw;
  z-index: 2;
  align-self: center;

  @media (max-width: 768px) {
    position: sticky;
    flex-direction: row;
    height: 100px;
    top: 0;
    left: 0;
    right: 0;
    left: 0;
    z-index: 2;
  }
`

const Toggle = styled.div`
  display: none;
  height: 100%;
  width:  20%;
  padding: 0 2rem;
  color: white;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Navbox = styled.div`
  display: flex;
  height: 100%;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: space-evenly;
    position: fixed;
    height: calc(100% - 99px);
    width: 100%;
    background-color: #0B6BBF;
    transition: all 0.3s ease-in;
    top: 99px;
    left: ${props => (props.open ? "-100%" : "0")};
  }

  @supports (-webkit-touch-callout: none) {
    height: calc(100% - 99px);
  }
`

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

  if (!hasMounted) {
    return (
      <div className="banner-renderer">
        <Link to="/">All In One</Link>
      </div>
    )
  }

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
    <Navigation className="navigation" id={ site === "client" ? "blue" : "red"}>
      <Home to="/">All In One</Home>
      <Toggle
        navbarOpen={navbarOpen}
        onClick={() => triggerNavbar()}
      >
        {navbarOpen ? 
        <Hamburger open /> 
        : <Hamburger />}
      </Toggle>
      {navbarOpen ? (
        <Navbox>
          <NavbarLinks siteType={ site } setNavbarOpen={setNavbarOpen}/>
        </Navbox>
      ) : (
        <Navbox open>
          <NavbarLinks siteType = { site } setNavbarOpen={setNavbarOpen}/>
        </Navbox>
      )}
    </Navigation>
  )
}

export default Navbar