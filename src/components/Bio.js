import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Socials } from '../components/Socials';

import { rhythm } from '../utils/typography';
const styles = {
    display: 'flex',
    marginBottom: rhythm(2.5),
    fontSize: '1.0em',
};

function Bio() {
    return (
        <StaticQuery
            query={bioQuery}
            render={data => {
                const { author, socials } = data.site.siteMetadata;
                return (
                    <div className="bio" style={styles}>
                        {/* <Image
                            fixed={'data.avatar.childImageSharp.fixed'}
                            alt={author}
                            style={{
                                marginRight: rhythm(1 / 2),
                                marginBottom: 0,
                                minWidth: 50,
                                borderRadius: '100%',
                            }}
                            imgStyle={{
                                borderRadius: '50%',
                            }}
                        /> */}
                        <p>
                            Written by <strong>{author}</strong> who lives in
                            Brooklyn and builds things using computers.{' '}
                        </p>
                        <Socials />
                    </div>
                );
            }}
        />
    );
}

const bioQuery = graphql`
    query BioQuery {
        avatar: file(absolutePath: { regex: "/pixelpic/" }) {
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
            }
        }
    }
`;

export default Bio;
