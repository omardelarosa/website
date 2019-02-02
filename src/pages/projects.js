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
                projects = [],
            },
        },
    },
    location,
}) => {
    return (
        <Layout location={location} title={title}>
            <SEO
                title="Projects"
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
            {projects.map(project => {
                return (
                    <div key={`project-section-${project.section}`}>
                        <h2>{project.section}</h2>
                        <ol className="projects-list">
                            {project.links.map(link => (
                                <li key={`project-link-${link.name}`}>
                                    <a href={link.url}>{link.name}</a> -{' '}
                                    {link.description}
                                </li>
                            ))}
                        </ol>
                    </div>
                );
            })}
            <div style={{ textAlign: 'center' }}>
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
                projects {
                    section
                    links {
                        url
                        description
                        name
                    }
                }
            }
        }
    }
`;
