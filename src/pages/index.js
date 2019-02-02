import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/seo';

import { HomeSplash } from '../components/HomeSplash';

class Home extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle } = data.site.siteMetadata;

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="Homepage"
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                />
                <HomeSplash />
            </Layout>
        );
    }
}

export default Home;

export const pageQuery = graphql`
    query {
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
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        date
                        title
                    }
                }
            }
        }
    }
`;
