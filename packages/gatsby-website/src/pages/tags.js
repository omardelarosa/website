import React from 'react';
import PropTypes from 'prop-types';

// Utilities
import _ from 'lodash';

// Components
import Layout from '../components/Layout';
import SEO from '../components/seo';
import { useStaticQuery, Link, graphql } from 'gatsby';
import Bio from '../components/Bio';

const TagsPage = ({
    location,
}) => {
    const data = useStaticQuery(pageQuery);
    const sortedGroups = _.sortBy(data.allMarkdownRemark.group, [
        tag => Number(tag.totalCount),
    ]).reverse();
    const tagKeywords = sortedGroups.map(t => t.fieldValue);
    return (
        <Layout location={location} title={data.site.siteMetadata.title}>
            <SEO
                title="All tags | omardelarosa.com"
                keywords={['blog', ...tagKeywords]}
            />{' '}
            <div>
                <h1>Tags</h1>
                <ul>
                    {sortedGroups.map(tag => (
                        <li key={tag.fieldValue}>
                            <Link to={`/tags/${_.kebabCase(tag.fieldValue)}/`}>
                                {tag.fieldValue} ({tag.totalCount})
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <hr />
            <Bio />
        </Layout>
    );
};

TagsPage.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            group: PropTypes.arrayOf(
                PropTypes.shape({
                    fieldValue: PropTypes.string.isRequired,
                    totalCount: PropTypes.number.isRequired,
                }).isRequired
            ),
        }),
        site: PropTypes.shape({
            siteMetadata: PropTypes.shape({
                title: PropTypes.string.isRequired,
            }),
        }),
    }),
};

export default TagsPage;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 2000) {
            group(field: frontmatter___tags) {
                fieldValue
                totalCount
            }
        }
    }
`;
