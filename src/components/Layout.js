import React from 'react';
import { Link } from 'gatsby';
import { Navigation } from '../components/Navigation';
import { Socials } from '../components/Socials';
import { rhythm } from '../utils/typography';
import './Layout.styl';

class Layout extends React.Component {
    render() {
        const { location, title, children } = this.props;
        const rootPath = `${__PATH_PREFIX__}/`;
        let header;
        let footer;

        if (location.pathname === rootPath) {
            header = null; // No header on root
            footer = null; // No footer on root
        } else {
            header = (
                <div className="header">
                    <div className="subheading-wrapper">
                        <h3 className="subheading" style={{}}>
                            <Link
                                style={{
                                    boxShadow: 'none',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                                to={'/'}
                            >
                                {title}
                            </Link>
                        </h3>
                        <Navigation small />
                    </div>
                    <hr />
                </div>
            );
            footer = (
                <footer className="footer">
                    <span>
                        © {new Date().getFullYear()}, Built with{'  '}
                        <a href="https://www.gatsbyjs.org"> Gatsby</a>
                    </span>
                </footer>
            );
        }
        return (
            <div
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: rhythm(24),
                    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
                }}
            >
                <header>{header}</header>
                <main>{children}</main>
                {footer}
            </div>
        );
    }
}

export default Layout;
