const fs = require('fs');
const path = require('path');

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
    // console.log(filename, filepath);
    let [timestampStr, slug = ''] = filename.split('_');
    slug = slug.split('.').shift();
    console.log(timestampStr, slug);
    const postPath = path.join(NEW_POSTS_PATH, slug);
    fs.mkdirSync(postPath);
    const data = fs.readFileSync(filepath);
    const newFileName = path.join(postPath, 'index.md');
    fs.writeFileSync(newFileName, data);
    console.log('Created file: \t', newFileName, '\tfrom', filepath);
}

async function main() {
    const oldPostsDir = path.join(cwd, OLD_POSTS_PATH);
    const oldPosts = fs.readdirSync(oldPostsDir);
    console.log('Migrating old posts:', oldPosts);
    oldPosts.map(postName => {
        if (!ignoreFiles.includes(postName)) {
            return createPostDir(postName, path.join(oldPostsDir, postName));
        } else {
            return null;
        }
    
    });
}

main();
