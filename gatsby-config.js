module.exports = {
  siteMetadata: {
    title: `Dérick Paradis - Designer`,
    description: `I try to create delightful designs and user experiences using proven principles while keeping communication as first goal.`,
    author: `@parader`,
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Dérick Paradis Portfolio`,
        short_name: `DP Portfolio`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon2.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_ID || "UA-xxxxxxxxx-x",
        head: false,
        respectDNT: true,
        defer: true,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-offline`,
    "gatsby-plugin-sass",
    "gatsby-plugin-smoothscroll",
  ],
}
