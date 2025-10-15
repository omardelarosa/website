import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import PostsList from '../components/PostsList';
import Bio from '../components/Bio';
import { PROCESS_TAG } from '../pages/process';
import _ from 'lodash';

class MediaPage extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle } = data.site.siteMetadata;
        const posts = data.allMarkdownRemark.edges.filter(p => {
            // Exclude process posts
            if (_.includes(p.node.frontmatter.tags, PROCESS_TAG)) {
                return false;
            }
            return true;
        });
        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="Media | omardelarosa.com"
                    keywords={[
                        'blog',
                        'gatsby',
                        'javascript',
                        'react',
                        'software engineer',
                        'developer',
                        'musician',
                        'technologist',
                        'technology',
                        'media',
                        'videos',
                        'livecode',
                        'generative music',
                        'generative art',
                        'algorithmic art',
                        'algorithmic music',
                        'computer graphics',
                    ]}
                />
                <h1>Media</h1>
                <p>Coming Soon...</p>
                <Bio />
            </Layout>
        );
    }
}

export default MediaPage;

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
