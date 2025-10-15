import React from 'react';
import { graphql } from 'gatsby';

import _ from 'lodash';
import BlogList, { MAX_PER_PAGE } from '../templates/blog-list';

class Home extends React.Component  {
    render() {
        const { data } = this.props;
        return <BlogList data={data} />
    }
}

export default Home;

export const pageQuery = graphql`
query blogListQuery {
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
      limit: 5
      skip: 0
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
                thumbnail {
                    childImageSharp {
                        gatsbyImageData
                    }
                }
            }
        }
      }
    }
  }
`;
