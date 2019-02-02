import React from 'react';
import { Link, graphql } from 'gatsby';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Logo from '../../content/assets/pixelpic.gif';
import { node } from 'prop-types';
import styles from './index.styl';

class Home extends React.Component {
    render() {
        const { data } = this.props;
        const { title: siteTitle, author, sections } = data.site.siteMetadata;

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title="Homepage"
                    keywords={['blog', 'gatsby', 'javascript', 'react']}
                />
                <h1 className="homepage-heading">{author}</h1>
                <div style={{ textAlign: 'center' }}>
                    <img src={Logo} alt="Logo" />
                </div>
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
            </Layout>
        );
    }
}

export default Home;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
                author
                sections {
                    name
                    path
                }
            }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        date
                        title
                    }
                }
            }
        }
    }
`;
