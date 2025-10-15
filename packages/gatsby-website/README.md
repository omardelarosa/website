# Website

The source code for my blog and personal website built using Gatsby. Visit at [omardelarosa.com](https://classic.omardelarosa.com)

The code is based on the following starter project: https://github.com/gatsbyjs/gatsby-starter-blog

## CLI Usage

```
usage: cli.js [-h] [-v] [-c CREATE] [-t TAGS] [-d]

Post management cli

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -c CREATE, --create CREATE
                        create post
  -t TAGS, --tags TAGS  attach tags
  -d, --debug           enabled debug mode
```

## Examples

### Creating a new post

```bash
bin/cli.js -c "My New Post Title"
```

### Creating a post with tags

```bash
bin/cli.js -c "My New Post Title" -t tag1 -t tag2 -t tag3
```

### Debuging Markdown Generation

```bash
bin/cli.js -c "My New Post Title" -t tag1 -t tag2 -t tag3 -d

```

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

```bash
npm run develop
```

The dev site runs on `http://localhost:8080` and its GraphQL server on the `/____graphql` route.

## Deployment

Deployment is managed using netlify.

```bash
git push origin master
```
