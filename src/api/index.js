// NOTE: This file must be common-js compatible
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const CONTENT_PATH = 'content/blog';
const DEFAULT_FILE_NAME = 'index.md';
const CONTENT_FULL_PATH = path.join(__dirname, '../../', CONTENT_PATH);

const renderPost = (locals = {}) => {
    const { title, timestamp, slug, fileBody, tags = [] } = locals;
    let body = 'Insert words here.';
    if (fileBody) {
        body = fileBody;
    }
    return `
---
title: ${title}
date: ${timestamp}
createdAt: ${timestamp}
publishedAt: ${timestamp}
slug: ${slug}
tags: [${tags.map(t => `'${t}'`).join(', ')}]
---

${body}
    `;
};

class API {
    constructor(args) {
        this.args = args;
        // Supported actions
        this.actions = {
            create: this.create,
        };

        // Attempt to parse args
        this.parseArgs(args);
    }
    parseArgs(args) {
        Object.keys(this.args).forEach(argName => {
            const action = this.actions[argName];
            if (action) {
                // Call action with given args from namespace
                action(args[argName], args);
            }
        });
    }

    create(title, args) {
        const slug = slugify(title, { lower: true });
        const destinationPath = path.join(CONTENT_FULL_PATH, slug);
        if (!fs.existsSync(destinationPath)) {
            const tags = args.tags || [];
            const fileBody = null;
            console.log('Creating post at: ', CONTENT_FULL_PATH + '/' + slug);
            const props = {
                title,
                slug,
                timestamp: Date.now(),
                fileBody,
                tags,
            };
            const postStr = renderPost(props);

            if (args.debug) {
                console.log(postStr);
                return;
            } else {
                try {
                    fs.mkdirSync(destinationPath);
                    fs.writeFileSync(
                        path.join(destinationPath, DEFAULT_FILE_NAME),
                        postStr
                    );
                } catch (err) {
                    console.log(`Unable to create post: ${destinationPath}`);
                    throw err;
                }
            }
        } else {
            throw new Error(`A post with slug ${slug} exists! Try a variation`);
        }
    }
}

module.exports = API;
