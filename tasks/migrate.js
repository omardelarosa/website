const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const OLD_POSTS_PATH = '../omardelarosa.github.io/_posts';
const NEW_POSTS_DIR_NAME = 'content/blog';
const NEW_POSTS_PATH = path.join(cwd, NEW_POSTS_DIR_NAME);

function createPostDir(filename, filepath) {
    // console.log(filename, filepath);
    let [timestampStr, slug] = filename.split('_');
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
    oldPosts.map(postName =>
        createPostDir(postName, path.join(oldPostsDir, postName))
    );
}

main();
