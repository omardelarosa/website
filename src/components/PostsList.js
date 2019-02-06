import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { formatTimestamp } from '../utils/dates';
import { rhythm } from '../utils/typography';
import { TagList, PRIVATE_TAG } from '../components/TagList';
import _ from 'lodash';

class PostsList extends React.Component {
    render() {
        return (
            <StaticQuery
                query={pageQuery}
                render={data => {
                    const posts = data.allMarkdownRemark.edges;
                    return (
                        <div class="posts-list">
                            {posts.map(({ node }) => {
                                const title =
                                    node.frontmatter.title || node.fields.slug;
                                const tags = node.frontmatter.tags || [];
                                // Hides any private posts
                                if (_.includes(tags, PRIVATE_TAG)) {
                                    return null;
                                }
                                return (
                                    <div key={node.fields.slug}>
                                        <h3
                                            style={{
                                                marginBottom: rhythm(1 / 4),
                                            }}
                                        >
                                            <Link
                                                style={{ boxShadow: 'none' }}
                                                to={`${node.fields.url}`}
                                            >
                                                {title}
                                            </Link>
                                        </h3>
                                        <small>
                                            {formatTimestamp(
                                                node.frontmatter.date
                                            )}
                                        </small>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: node.excerpt,
                                            }}
                                        />
                                        <small>
                                            <TagList tags={tags} />
                                        </small>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }}
            />
        );
    }
}

export default PostsList;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                        url
                    }
                    frontmatter {
                        date
                        title
                        tags
                    }
                }
            }
        }
    }
`;
