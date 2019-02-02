import React from 'react';
import { Sprite } from '../components/Sprite';

const SOCIALS = [
    {
        name: 'LinkedIn',
        slug: 'linkedin',
        url: 'https://',
        text: 'Add me on LinedIn',
    },
    {
        name: 'Github',
        slug: 'github',
        url: 'https://github.com/omardelarosa',
        text: 'Follow me on Github',
    },
    {
        name: 'Tumblr',
        slug: 'tumblr',
        url: 'https://omardelarosa.tumblr.com',
        text: 'Follow me on Tumblr',
    },
    {
        name: 'Twitter',
        slug: 'twitter',
        url: 'https://twitter.com/omardelarosa',
        text: 'Follow me on Twitter',
    },
];

export function Socials() {
    const socials = SOCIALS;
    return (
        <div className="socials">
            {socials.map(({ name, slug, url, text }) => (
                <a href={url}>
                    <Sprite name={slug} text={text} />
                </a>
            ))}
        </div>
    );
}
