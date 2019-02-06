import React from 'react';
import { Link, graphql } from 'gatsby';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import PostsList from '../components/PostsList';

class BlogIndex extends React.Component {
    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="All posts"
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                />
                <PostsList />
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
    }
`;
