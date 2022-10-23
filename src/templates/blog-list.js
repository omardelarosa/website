import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import PostsList from '../components/PostsList';
import Bio from '../components/Bio';
import SEO from '../components/seo';
import _ from 'lodash';

export default class BlogList extends React.Component {
  render() {
    const { data } = this.props;
    const { title: siteTitle } = data.site.siteMetadata;
    const posts = data.allMarkdownRemark.edges;
    const ctx = this.props.pageContext;
    const isFirst = !ctx || !ctx.skip === 0 || ctx.currentPage === 1;
    const isLast = !!ctx && ctx.numPages === ctx.currentPage;
    const nextPagePath = `/page/${!ctx ? "2" : ctx.currentPage + 1 }`;
    let prevPagePath = `/page/${!ctx ? "" : ctx.currentPage - 1 }`;
    
    // This allows the pagination to return to the root page for 1
    // with the correct URL.
    // NOTE: This can be removed if the index.js page ever becomes
    // unrelated to these bloggy pages
    if (ctx && ctx.currentPage === 2) {
      prevPagePath = "/";
    }

    return (
        <Layout location={this.props.location} title={siteTitle}>
            <SEO
                title="thoughts & content | by omar delarosa | omardelarosa.com"
                keywords={[
                    'blog',
                    'gatsby',
                    'javascript',
                    'react',
                    'software engineer',
                    'developer',
                    'musician',
                    'gamedev',
                    'ai',
                    'machine learning',
                    'ml',
                    'technologist',
                    'technology',
                    'typescript',
                ]}
            />
            <PostsList posts={posts} />
            <hr />
            <div class="pagination">
              {!isFirst ? (
                <Link to={prevPagePath} rel="prev">
                  ← Previous Page
                </Link>
              ) : <span>{""}</span>}
              {!isLast && (
                <Link to={nextPagePath} rel="next">
                  Next Page →
                </Link>
              )}
            </div>
            <hr />
            <Bio />
        </Layout>
    );
  }

  
}

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!, $skippedSlugs: [String]) {
    site {
        siteMetadata {
            title
            author
            sections {
                name
                path
            }
        }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip,
      filter: { fields: { slug: { nin: $skippedSlugs }}}
    ) {
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
`