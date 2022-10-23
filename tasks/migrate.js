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

const redirectsMapping = [];

function createPostDir(filename, filepath) {
    if (!filename) {
        console.log(`invalid post: filename '${filename}, filepath: '${filepath}'`);
        return;
    }
    console.log(filename, filepath);
    let [timestampStr, slug = ''] = filename.split('_');
    slug = slug.split('.').shift();
    console.log(timestampStr, slug);
    
    // fs.mkdirSync(postPath);
    console.log("filepath: ", filepath);
    const filesInPostDir = glob.sync(`${filepath}/**/*`);
    // const root = 
    // const targetDir = "";
    let datePrefix = null;

    // Find the published timestamp of post
    for (let f of filesInPostDir) {
        const { dir, base, ext } = path.parse(f);
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
            const { dir, base, ext } = path.parse(f);
            // quasi-root path
            const fileParts = filepath.split('/');
            const slugDir = fileParts[fileParts.length - 1];
            const targetPostPath = path.join(NEW_POSTS_PATH, datePrefix, slugDir);
            fs.mkdirSync(targetPostPath);
            const newPath = f.replace(slugDir, `${datePrefix}/${slugDir}`);
            
            // Do the copying
            fs.copyFileSync(f, newPath);

            // Register in mapping
            redirectsMapping.append({
                oldFilepath: f,
                slugDir,
                newFilePath: newPath
            });
        }
        // const data = fs.readFileSync(filepath);
        // const newFileName = path.join(postPath, 'index.md');
        // fs.writeFileSync(newFileName, data);
        // console.log('Created file: \t', newFileName, '\tfrom', filepath);
    }
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

    console.log(redirectsMapping);
}

main();
