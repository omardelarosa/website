import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Sprite } from '../components/Sprite';
import './Socials.styl';

export function Socials() {
    return (
        <StaticQuery
            query={socialsQuery}
            render={data => {
                const { socials } = data.site.siteMetadata;
                return (
                    <div className="socials">
                        {socials.map(({ name, slug, url, text }) => (
                            <a
                                key={`social-${slug}`}
                                href={url}
                                alt={name}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Sprite name={slug} text={text} />
                            </a>
                        ))}
                    </div>
                );
            }}
        />
    );
}

const socialsQuery = graphql`
    query SocialsQuery {
        site {
            siteMetadata {
                socials {
                    name
                    slug
                    url
                    text
                }
            }
        }
    }
`;
