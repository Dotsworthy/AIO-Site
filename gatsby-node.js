/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
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
    if (stage === 'build-html') {
      actions.setWebpackConfig({
        externals: getConfig().externals.concat(function(context, request, callback) {
          const regex = /^@?firebase(\/(.+))?/;
          // exclude firebase products from being bundled, so they will be loaded using require() at runtime.
          if (regex.test(request)) {
            return callback(null, 'umd ' + request);
          }
          callback();
        })
      });
    }
  }

  

  exports.onCreatePage = async ({page, actions}) => {
    const { createPage } = actions

    if (page.path.match(/^\/admin/)) {
      page.matchPath = "/admin/*"

      createPage(page)
    }

    // if(page.path.match(/^\/subjectList/)) {
      
    //   createPage({
    //     path: "/subjectList",
    //     matchPath: "/subjectList/*",
    //     component: path.resolve(`src/components/updateSubject`)
    //   })
    // }
  }
