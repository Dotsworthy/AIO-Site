/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Navbar from "./Navbar/Navbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-solid-svg-icons'
// import "./layout.css"
import "./styles.scss"

const Layout = ({ children, siteType }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Navbar siteType={siteType}/>
      {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1920,
          // padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer className="footer">
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
          <FontAwesomeIcon icon={faTwitter} />
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
