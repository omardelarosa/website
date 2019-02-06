import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import PostsList from '../components/PostsList';
import Bio from '../components/Bio';

class Home extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle } = data.site.siteMetadata;
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
                <PostsList />
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
    }
`;
