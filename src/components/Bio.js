import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import avatar from '../../content/assets/pixelpic-static.png';
import { Socials } from '../components/Socials';
import { rhythm } from '../utils/typography';

const styles = {
    display: 'flex',
    marginBottom: rhythm(1),
    fontSize: '1.0em',
};

function Bio() {
    return (
        <StaticQuery
            query={bioQuery}
            render={data => {
                const { author } = data.site.siteMetadata;
                return (
                    <div className="bio-wrapper">
                        <div className="bio" style={styles}>
                            <img src={avatar} className="avatar" />
                            <p>
                                Written by <strong>{author}</strong> who lives
                                in Brooklyn and builds things using computers.{' '}
                            </p>
                        </div>
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
            }
        }
    }
`;

export default Bio;
