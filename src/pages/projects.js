import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/seo";
import Bio from "../components/Bio";
import { graphql } from "gatsby";

// Import project images
import MOONSPORE_HOLLOW from "../../content/blog/devlog-1-moonspore-hollow/images/MoonsporeHollow-Clip-15s.mov.gif";
import INFINITY_TERRAIN from "../../content/blog/infinity-terrain-in-c++-using-perlin-noise-and-opengl/images/GIFs/gundam-flyover5.1-title.gif";
import SEAMLESS from "../../content/media/seamless-screenshot.png";
import VICE from "../../content/media/vice-screenshot.png";

const PROJECT_IMAGES = {
    MOONSPORE_HOLLOW,
    INFINITY_TERRAIN,
    SEAMLESS,
    VICE,
};

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
                title="Projects | omardelarosa.com"
                keywords={[
                    "blog",
                    "software engineer",
                    "webdev",
                    "software developer",
                    "musician",
                    "technology",
                ]}
            />
            <h1>Projects</h1>
            {projects.map((project) => {
                return (
                    <div key={`project-section-${project.section}`}>
                        <h2>{project.section}</h2>
                        <ol className="projects-list">
                            {project.links.map((link) => (
                                <li key={`project-link-${link.name}`}>
                                    <h3 className="project-title">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {link.name}
                                        </a>{" "}
                                    </h3>
                                    {link.imageUrl ? (
                                        <div className="project-image-container">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    alt={link.name}
                                                    className="project-image"
                                                    src={link.imageUrl}
                                                />
                                            </a>
                                        </div>
                                    ) : null}
                                    {link.imageKey ? (
                                        <div className="project-image-container">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    alt={link.name}
                                                    className="project-image"
                                                    src={
                                                        PROJECT_IMAGES[
                                                            link.imageKey
                                                        ]
                                                    }
                                                />
                                            </a>
                                        </div>
                                    ) : null}
                                    {link.youTubeEmbed ? (
                                        <iframe
                                            title={link.name}
                                            width="320"
                                            src={link.youTubeEmbed}
                                            frameborder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen
                                        ></iframe>
                                    ) : null}
                                    <div className="project-description">
                                        {link.description}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                );
            })}
            <div style={{ textAlign: "center" }}>
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
                        imageUrl
                        imageKey
                        youTubeEmbed
                    }
                }
            }
        }
    }
`;
