module.exports = {
  siteMetadata: {
    title: `All in One Education`,
    description: `Welcome to All in One Education.`,
    author: `All in One Education`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-source-firestore',
      options: {
        credential: require("./testproject-85401-firebase-adminsdk-jvfw5-3c231b2984.json"),
        types: [
          {
            type: 'Subjects',
            collection: 'subjects',
            map: doc => ({
              name: doc.name,
              description: doc.description,
              category: doc.category,
              level: doc.level,
              tags: doc.tags,
              image: doc.image,
              download: doc.download
            }),
          },
          {
            type: 'Blogs',
            collection: 'blogs',
            map: doc => ({
              title: doc.title,
              sub_title: doc.sub_title,
              author: doc.author,
              cover_img: doc.cover_img,
              tags: doc.tags,
              date: doc.date,
              timestamp: doc.timestamp
            })
          }
        ],
      },
    },
  ],
};
