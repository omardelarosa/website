import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import Logo from '../../content/assets/pixelpic.gif';
import { Navigation } from '../components/Navigation';

import './HomeSplash.styl';

export function HomeSplash() {
    return (
        <StaticQuery
            query={homeSplashQuery}
            render={data => {
                const { author } = data.site.siteMetadata;
                return (
                    <div className="homepage-splash">
                        <h1 className="homepage-heading">{author}</h1>
                        <div style={{ textAlign: 'center' }}>
                            <img src={Logo} alt="Logo" />
                        </div>
                        <Navigation />
                    </div>
                );
            }}
        />
    );
}

const homeSplashQuery = graphql`
    query HomeSplashQuery {
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
