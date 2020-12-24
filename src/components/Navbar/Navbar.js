import React, { useEffect, useState } from "react"
import NavbarLinks from "./NavbarLinks"
import { Link } from "gatsby"
// import Logo from "./Logo"

const Navbar = ( siteType ) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const site = String(siteType.siteType);

  const triggerNavbar = () => {
    if (navbarOpen === true) {
      setNavbarOpen(false)
      document.body.style.overflow = "auto"
    } else if (navbarOpen === false) {
      setNavbarOpen(true)
      document.body.style.overflow = "hidden"
    }
  }

  useEffect(() => {
    setHasMounted(true);
    document.body.style.overflow = "auto"
  },[])

  
  // if (navbarOpen === true) {
  //   body.style.overflow = "hidden"
  // } else if (navbarOpen === false) {
  //   body.style.overflow = "auto"
  // }

  return (
    <nav className="navigation" id={ site === "client" ? "blue" : "red"}>
      <Link className="home-link" to="/">All In One</Link>
      <button className="toggle" id="toggle"
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
      </button>
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