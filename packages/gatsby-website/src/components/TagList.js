import React from 'react';
import { Link } from 'gatsby';
import _ from 'lodash';

export const PRIVATE_TAG = 'private';

export function TagList({ tags }) {
    return (
        <ul className="tag-list">
            {tags
                .filter(tag => tag !== PRIVATE_TAG)
                .map(tag =>
                    tag === PRIVATE_TAG ? null : (
                        <li key={tag}>
                            <Link to={`/tags/${_.kebabCase(tag)}`}>{tag}</Link>
                        </li>
                    )
                )}
        </ul>
    );
}
