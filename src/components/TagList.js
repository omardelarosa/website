import React from 'react';
import { Link } from 'gatsby';

export function TagList({ tags }) {
    return (
        <ul className="tag-list">
            {tags.map(tag => (
                <li key={tag}>
                    <Link to={`/tags/${tag}`}>{tag}</Link>
                </li>
            ))}
        </ul>
    );
}
