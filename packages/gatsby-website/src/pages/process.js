import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import PostsList from '../components/PostsList';
import Bio from '../components/Bio';
import _ from 'lodash';

export const PROCESS_TAG = 'process';
const DESCRIPTION_TEXT =
    'A place for my work in Ideation and Prototyping class at NYU.  I will be posting weekly artifacts from learning to make 2D, pixelart-based game development here.';

class ProcessPage extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle } = data.site.siteMetadata;
        const posts = data.allMarkdownRemark.edges.filter(p => {
            const node = p.node;
            if (!node) return false;
            const tags = _.get(node, 'frontmatter.tags', []);
            return _.includes(tags, PROCESS_TAG);
        });
        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="Process: Ideation and Prototyping | omardelarosa.com"
                    keywords={[
                        'blog',
                        'pixelart',
                        'unity',
                        'gamedev',
                        'developer',
                        'musician',
                        'technologist',
                        'technology',
                    ]}
                />
                <h1>Process: Ideation and Prototyping</h1>
                <p>{DESCRIPTION_TEXT}</p>
                <PostsList posts={posts} />
                <hr />
                <Bio />
            </Layout>
        );
    }
}

export default ProcessPage;

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
