const path = require('path');
const POSTS_PATH = require('./config/paths').POSTS_PATH;
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    const blogPost = path.resolve('./src/templates/blog-post.js');
    const blogPostIndex = path.resolve('./src/templates/blog-index.js');

    return graphql(
        `
            {
                allMarkdownRemark(
                    sort: { fields: [frontmatter___date], order: DESC }
                    limit: 1000
                ) {
                    edges {
                        node {
                            fields {
                                slug
                                url
                            }
                            frontmatter {
                                title
                            }
                        }
                    }
                }
            }
        `
    ).then(result => {
        if (result.errors) {
            throw result.errors;
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;
        posts.forEach((post, index) => {
            const previous =
                index === posts.length - 1 ? null : posts[index + 1].node;
            const next = index === 0 ? null : posts[index - 1].node;

            createPage({
                path: post.node.fields.url,
                component: blogPost,
                context: {
                    slug: post.node.fields.slug,
                    previous,
                    next,
                },
            });
        });

        // Create blog index page
        createPage({
            path: `${POSTS_PATH}`,
            component: blogPostIndex,
            context: {},
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    // Handles posts
    if (node.internal.type === 'MarkdownRemark') {
        const value = createFilePath({ node, getNode, trailingSlash: false });
        // Creates slug field
        createNodeField({
            name: 'slug',
            node,
            value,
        });
        // Creates url field
        createNodeField({
            name: 'url',
            node,
            value: `${POSTS_PATH}${value}`,
        });
    }
};
