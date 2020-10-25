/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateWebpackConfig = ({ stage, actions }) => {
    if (stage.startsWith("develop")) {
      actions.setWebpackConfig({
        node: {
          fs: "empty",
        },
        resolve: {
          alias: {
            "react-dom": "@hot-loader/react-dom",
          },
        },
      })
    }
  }

  exports.onCreatePage = async ({page, actions}) => {
    const { createPage } = actions

    if (page.path.match(/^\/admin/)) {
      page.matchPath = "/admin/*"

      createPage(page)
    }
  }
