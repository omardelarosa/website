import React from 'react';
import './Sprite.styl';
import linkedin from '../../content/assets/linkedin.png';
import github from '../../content/assets/github.png';
import twitter from '../../content/assets/twitter.png';
import tumblr from '../../content/assets/tumblr.png';

const IMAGES = {
    linkedin,
    github,
    twitter,
    tumblr,
};

export function Sprite({ name }) {
    const image = IMAGES[name];
    if (!image) {
        console.warn('Unknown sprite: ', name);
        return null;
    }
    return <img className={`sprite s-${name}`} src={image} />;
}
