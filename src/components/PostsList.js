import React from 'react';
import { Link } from 'gatsby';
import { formatTimestamp } from '../utils/dates';
import { rhythm } from '../utils/typography';
import { TagList, PRIVATE_TAG } from '../components/TagList';
import _ from 'lodash';

class PostsList extends React.Component {
    render() {
        const posts = this.props.posts || [];
        return (
            <div className="posts-list">
                {posts.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    const tags = node.frontmatter.tags || [];

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
                                {formatTimestamp(node.frontmatter.date)}
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
    }
}

export default PostsList;
