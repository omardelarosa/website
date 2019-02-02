import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

export function Navigation() {
    return (
        <StaticQuery
            query={navQuery}
            render={data => {
                const { sections } = data.site.siteMetadata;
                return (
                    <ul className="homepage-links">
                        {sections.map(({ name, path }) => (
                            <li>
                                <Link
                                    className="homepage-link"
                                    style={{ boxShadow: 'none' }}
                                    to={path}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                );
            }}
        />
    );
}

const navQuery = graphql`
    query NavQuery {
        avatar: file(absolutePath: { regex: "/pixelpic-static/" }) {
            childImageSharp {
                fixed(width: 128, height: 128) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        site {
            siteMetadata {
                author
                social {
                    twitter
                }
                sections {
                    name
                    path
                }
            }
        }
    }
`;
