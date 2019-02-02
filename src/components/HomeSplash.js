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

                        <hr />
                        <div style={{ textAlign: 'center' }}>
                            <Link to={'/posts'}>
                                <img src={Logo} alt="Logo" />
                            </Link>
                        </div>
                        <hr />
                        <Navigation small />
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
            }
        }
    }
`;
