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

let filesSeen = 0;
let filesCopied = 0;

function createPostDir(filename, filepath) {
    if (!filename) {
        console.log(`invalid post: filename '${filename}, filepath: '${filepath}'`);
        return;
    }
    const filesInPostDir = glob.sync(`${filepath}/**/*`);
    let datePrefix = null;
    
    filesSeen += filesInPostDir.length;

    // Find the published timestamp of post
    for (let f of filesInPostDir) {
        console.log('file: ', f);
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
        const filesToCopy = glob.sync(`${filepath}/**/*`);
        if (filesToCopy.length !== filesInPostDir.length) {
            throw new Error('Imbalanced file location: ' + filepath);
        }

        const fileParts = filepath.split('/');
        const slugDir = fileParts[fileParts.length - 1];
        const targetPostPath = path.join(NEW_POSTS_PATH, datePrefix, slugDir);
        
        // Do the copying
        fs.cpSync(filepath, targetPostPath, { recursive: true });
        filesCopied += filesToCopy.length;

        // Register in mapping
        return {
            type: "post",
            sourceFile: filename,
            date: datePrefix,
            slug: slugDir,
            outputFile: targetPostPath
        };
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

    console.log(`files copied: ${filesCopied}/${filesSeen} (copied/seen)`);

    // Remove nulls
    const jsonStr = JSON.stringify(remaps.filter(f => !!f), undefined, 4);

    const redirectsMappingPath = `config/redirects.json`;

    fs.writeFileSync(redirectsMappingPath, jsonStr);

    const oldFiles = glob.sync(`${OLD_POSTS_PATH}/**/*`);
    const newFiles = glob.sync(`${NEW_POSTS_DIR_NAME}/**/*`);

    const oldFilesCount = oldFiles.length;
    const newFilesCount = newFiles.length;

    console.log(`old files vs new: ${newFilesCount}/${oldFilesCount} (new/old)`);
    console.log('redirects mapping written to: ', redirectsMappingPath);
}

main();
