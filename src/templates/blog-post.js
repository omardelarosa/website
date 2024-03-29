import React from 'react';
import { Link, graphql } from 'gatsby';
import { formatTimestamp } from '../utils/dates';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import { TagList } from '../components/TagList';
import { rhythm, scale } from '../utils/typography';

class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = this.props.data.site.siteMetadata.title;
        const { previous, next } = this.props.pageContext;

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title={`${post.frontmatter.title} | omardelarosa.com`}
                    description={post.excerpt}
                    keywords={['blog', 'blog post', ...post.frontmatter.tags]}
                />
                <h1>{post.frontmatter.title}</h1>
                <p
                    style={{
                        ...scale(-1 / 5),
                        display: 'block',
                        marginBottom: rhythm(1),
                        marginTop: rhythm(-1),
                    }}
                >
                    <small>{formatTimestamp(post.frontmatter.date)}</small>
                    <small>
                        <TagList tags={post.frontmatter.tags} />
                    </small>
                </p>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <hr
                    style={{
                        marginBottom: rhythm(1),
                    }}
                />
                <div
                    className="pagination"
                    style={{
                        marginBottom: rhythm(1),
                    }}
                >{previous && (
                        <Link to={previous.fields.url} rel="prev">
                            ← {previous.frontmatter.title}
                        </Link>
                    )}
                  {next && (
                        <Link to={next.fields.url} rel="next">
                            {next.frontmatter.title} →
                        </Link>
                    )}
                </div>
                <hr />
                <Bio />
            </Layout>
        );
    }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
                author
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                author
                date
                tags
            }
        }
    }
`;
