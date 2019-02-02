import React from 'react';
import Logo from '../../content/assets/pixelpic.gif';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Bio from '../components/bio';
import { Link, graphql } from 'gatsby';

const AboutPage = ({
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
            {/* <h1>About</h1> */}
            <div style={{ textAlign: 'center' }}>
                <Link to={'/posts'}>
                    <img src={Logo} alt="Logo" />
                </Link>
                <p>{`${author} ${text}`}</p>
                <hr />
            </div>
        </Layout>
    );
};
export default AboutPage;
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
