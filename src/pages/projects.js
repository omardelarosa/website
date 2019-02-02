import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Bio from '../components/Bio';
import { graphql } from 'gatsby';

const ProjectsPage = ({
    data: {
        site: {
            siteMetadata: {
                title,
                author,
                about: { text },
            },
        },
    },
    location,
}) => {
    return (
        <Layout location={location} title={title}>
            <SEO
                title="About Page"
                keywords={[
                    'blog',
                    'software engineer',
                    'webdev',
                    'software developer',
                    'musician',
                    'technology',
                ]}
            />
            <h1>Projects</h1>
            <div style={{ textAlign: 'center' }}>
                PROJECTS
                <hr />
                <Bio />
            </div>
        </Layout>
    );
};
export default ProjectsPage;
export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
                author
                about {
                    text
                }
            }
        }
    }
`;
