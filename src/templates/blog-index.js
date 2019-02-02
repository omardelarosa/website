import React from 'react';
import { Link, graphql } from 'gatsby';
import { formatTimestamp } from '../utils/dates';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import { TagList } from '../components/TagList';

class BlogIndex extends React.Component {
    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        const posts = data.allMarkdownRemark.edges;
        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="All posts"
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                />
                {posts.map(({ node }) => {
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
        );
    }
}

export default BlogIndex;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                        url
                    }
                    frontmatter {
                        date
                        title
                        tags
                    }
                }
            }
        }
    }
`;
