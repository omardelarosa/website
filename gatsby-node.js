const path = require('path');
const _ = require('lodash');
const POSTS_PATH = require('./config/paths').POSTS_PATH;
const { createFilePath } = require('gatsby-source-filesystem');

const POST = 'POST';
const MEDIA = 'MEDIA';
const ASSET = 'ASSET';
const NONE = 'NONE';

const TYPES_MAPPING = {
    blog: POST,
    media: MEDIA,
    assets: ASSET,
    default: NONE,
};

function deriveTypeForNode(node, getNode) {
    if (node.parent) {
        const parentNode = getNode(node.parent);
        // Keep going until there is no parent
        return deriveTypeForNode(parentNode, getNode);
    } else {
        const sourceInstanceName = node.sourceInstanceName;
        return TYPES_MAPPING[sourceInstanceName] || TYPES_MAPPING.default;
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage, createRedirect } = actions;
    
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const tagTemplate = path.resolve('./src/templates/tags.js');

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
                                tags
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

        // Tag pages:
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        _.each(posts, edge => {
            if (_.get(edge, 'node.frontmatter.tags')) {
                tags = tags.concat(edge.node.frontmatter.tags);
            }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);
        // Make tag pages
        tags.forEach(tag => {
            createPage({
                path: `/tags/${_.kebabCase(tag)}`,
                component: tagTemplate,
                context: {
                    tag,
                },
            });
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

        const nodeType = deriveTypeForNode(node, getNode);
        // console.log('NODE: ', node, nodeType);
        // Creates a type field
        createNodeField({
            name: 'type',
            node,
            value: nodeType,
        });
    }
};
