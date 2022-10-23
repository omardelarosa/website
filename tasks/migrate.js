const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const moment = require('moment');
const glob = require("glob")

const cwd = process.cwd();
const OLD_POSTS_PATH = 'content/blog/';
const NEW_POSTS_DIR_NAME = 'content/blog2';
const NEW_POSTS_PATH = path.join(cwd, NEW_POSTS_DIR_NAME);

const ignoreFiles = [
    '.DS_Store',
    '__untitled__'
];

function createPostDir(filename, filepath) {
    if (!filename) {
        console.log(`invalid post: filename '${filename}, filepath: '${filepath}'`);
        return;
    }
    const filesInPostDir = glob.sync(`${filepath}/**/*`);
    let datePrefix = null;

    // Find the published timestamp of post
    for (let f of filesInPostDir) {
        const { ext } = path.parse(f);
        if (ext === '.md') {
            const data = fs.readFileSync(f, {encoding:'utf8', flag:'r'});
            const content = fm(data.toString());
            if (content && content.attributes) {
                const publishedTs = content.attributes.publishedAt;
                const dt = moment(publishedTs);
                datePrefix = dt.format('YYYY/MM/DD');
            }
        }
    }

    if (!datePrefix) {
        console.log('unable to find date prefix for: ', filename);
    } else {


        // Find the published timestamp of post
        for (let f of filesInPostDir) {
            const { ext } = path.parse(f);
            // quasi-root path
            const fileParts = filepath.split('/');
            const slugDir = fileParts[fileParts.length - 1];
            const targetPostPath = path.join(NEW_POSTS_PATH, datePrefix, slugDir);

            fs.mkdirSync(targetPostPath, { recursive: true });

            const f2 = f.replace(OLD_POSTS_PATH, `${NEW_POSTS_DIR_NAME}/`);

            const newPath = f2.replace(slugDir, `${datePrefix}/${slugDir}`)

            // Do the copying
            fs.cpSync(f, newPath, { recursive: true });

            // Register in mapping
            if (ext === '.md') {
                return {
                    type: "post",
                    oldFilepath: f,
                    date: datePrefix,
                    slug: slugDir,
                    newFilePath: newPath
                };    
            } else {
                // Separate posts from assets
                return {
                    type: "asset",
                    oldFilepath: f,
                    date: datePrefix,
                    slug: slugDir,
                    newFilePath: newPath
                };
            }
        }
    }
}

async function main() {
    const oldPostsDir = path.join(cwd, OLD_POSTS_PATH);
    const oldPosts = fs.readdirSync(oldPostsDir);
    console.log('Migrating old posts:', oldPosts);
    const remaps = oldPosts.map(postName => {
        if (!ignoreFiles.includes(postName)) {
            return createPostDir(postName, path.join(oldPostsDir, postName));
        } else {
            return null;
        }
    });

    // Remove nulls
    const jsonStr = JSON.stringify(remaps.filter(f => !!f), undefined, 4);

    const redirectsMappingPath = `config/redirects.json`;

    fs.writeFileSync(redirectsMappingPath, jsonStr);

    console.log('redirects mapping written to: ', redirectsMappingPath);
}

main();
