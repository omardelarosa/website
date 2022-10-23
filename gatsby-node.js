const path = require('path');
const _ = require('lodash');
const POSTS_PATH = require('./config/paths').POSTS_PATH;
const REDIRECTS = require('./config/redirects.json');

const { createFilePath } = require('gatsby-source-filesystem');

const POST = 'POST';
const MEDIA = 'MEDIA';
const ASSET = 'ASSET';
const NONE = 'NONE';

const UPDATE_TAG = 'update';
const PROCESS_TAG = 'process';

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

function isNotBlogPage(p) {
    {
        // Exclude process posts
        const tags = p.node.frontmatter.tags;
        if (
            _.includes(tags, PROCESS_TAG) &&
            !_.includes(tags, UPDATE_TAG)
        ) {
            return true;
        }
        return false;
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage, createRedirect } = actions;

    const blogPost = path.resolve('./src/templates/blog-post.js');
    const tagTemplate = path.resolve('./src/templates/tags.js');
    const blogList = path.resolve("./src/templates/blog-list.js");

    // Create redirects
    REDIRECTS.forEach(redirect => {
        if (redirect.type === "post") {
            createRedirect({
                fromPath: `/posts/${redirect.slug}`, 
                toPath: `/posts/${redirect.date}/${redirect.slug}`, 
                isPermanent: true
            });
        }
    });

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

        // Add pagination
        const skippedSlugs = posts
            .filter(isNotBlogPage)
            .map(post => post?.node?.fields?.slug);
        const postsPerPage = 5

        console.log("skipped_slugs:", skippedSlugs);

        // pages with removed ones
        const numPages = Math.ceil((posts.length - skippedSlugs.length) / postsPerPage);

        console.log('total_pagination_pages: ', numPages);

        Array.from({ length: numPages }).forEach((_, i) => {
            const url = `/page/${i + 1}`;
            // Technically, page 0 doesn't need to be created.
            // however, it's useful in case I ever change the index.js
            // page to something else.
            
            createPage({
                path: url,
                component: blogList,
                context: {
                    limit: postsPerPage,
                    skip: i * postsPerPage,
                    numPages,
                    currentPage: i + 1,
                    skippedSlugs
                },
            })
        })

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
        // Creates a type field
        createNodeField({
            name: 'type',
            node,
            value: nodeType,
        });
    }
};
