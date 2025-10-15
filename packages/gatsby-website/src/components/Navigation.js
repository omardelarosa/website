import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import classnames from 'classnames';

export function Navigation({ small = false }) {
    return (
        <StaticQuery
            query={navQuery}
            render={data => {
                const { sections } = data.site.siteMetadata;
                return (
                    <nav
                        className={classnames({
                            navigation: true,
                            'navigation-small': !!small,
                        })}
                    >
                        <ol className="flex-container">
                            {sections.map(({ name, path }) => (
                                <li key={`navlink-${name}`}>
                                    <Link
                                        className="homepage-link"
                                        style={{ boxShadow: 'none' }}
                                        to={path}
                                    >
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </nav>
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
                sections {
                    name
                    path
                }
            }
        }
    }
`;
