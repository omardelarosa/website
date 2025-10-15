import React from 'react';
import PropTypes from 'prop-types';
import { formatTimestamp } from '../utils/dates';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import { TagList } from '../components/TagList';
import Bio from '../components/Bio';
import { rhythm } from '../utils/typography';
// Components
import { Link, graphql } from 'gatsby';

const Tags = ({ pageContext, data, location }) => {
    const { tag } = pageContext;
    const { edges, totalCount } = data.allMarkdownRemark;
    const siteTitle = data.site.siteMetadata.title;
    const tagHeader = `${totalCount} post${
        totalCount === 1 ? '' : 's'
    } tagged with "${tag}"`;

    return (
        <div>
            <Layout location={location} title={siteTitle}>
                <SEO
                    title={`${tag} | Tag Page | omardelarosa.com`}
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                />
                <h1>{tagHeader}</h1>
                {edges.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    return (
                        <div key={node.fields.slug}>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link
                                    style={{ boxShadow: 'none' }}
                                    to={`${node.fields.url}`}
                                >
                                    {title}
                                </Link>
                            </h3>
                            <small>
                                {formatTimestamp(node.frontmatter.date)}
                            </small>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: node.excerpt,
                                }}
                            />
                            <small>
                                <TagList tags={node.frontmatter.tags} />
                            </small>
                        </div>
                    );
                })}
                <hr />
                <Bio />
            </Layout>
        </div>
    );
};

Tags.propTypes = {
    pageContext: PropTypes.shape({
        tag: PropTypes.string.isRequired,
    }),
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            totalCount: PropTypes.number.isRequired,
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        frontmatter: PropTypes.shape({
                            path: PropTypes.string.isRequired,
                            title: PropTypes.string.isRequired,
                        }),
                    }),
                }).isRequired
            ),
        }),
    }),
};

export default Tags;

export const pageQuery = graphql`
    query($tag: String) {
        site {
            siteMetadata {
                title
                author
            }
        }
        allMarkdownRemark(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { tags: { in: [$tag] } } }
        ) {
            totalCount
            edges {
                node {
                    excerpt
                    fields {
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
`;
