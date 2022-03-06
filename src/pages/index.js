import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import PostsList from '../components/PostsList';
import Bio from '../components/Bio';
import { PROCESS_TAG } from '../pages/process';
import _ from 'lodash';

const UPDATE_TAG = 'update';

class Home extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle } = data.site.siteMetadata;
        const posts = data.allMarkdownRemark.edges.filter(p => {
            // Exclude process posts
            const tags = p.node.frontmatter.tags;
            if (
                _.includes(tags, PROCESS_TAG) &&
                !_.includes(tags, UPDATE_TAG)
            ) {
                return false;
            }
            return true;
        });
        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="Homepage | omardelarosa.com"
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
                        'typescript',
                    ]}
                />
                <PostsList posts={posts} />
                <hr />
                <Bio />
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
