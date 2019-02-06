import React from 'react';
import { Link } from 'gatsby';

export const PRIVATE_TAG = 'private';

export function TagList({ tags }) {
    return (
        <ul className="tag-list">
            {tags.map(tag =>
                tag === PRIVATE_TAG ? null : (
                    <li key={tag}>
                        <Link to={`/tags/${tag}`}>{tag}</Link>
                    </li>
                )
            )}
        </ul>
    );
}
