module.exports = {
    siteMetadata: {
        title: 'Omar Delarosa',
        author: 'Omar Delarosa',
        authorSocials: {
            twitter: 'omardelarosa',
            instagram: 'omdel',
        },
        description: 'The website of Omar Delarosa',
        siteUrl: 'https://www.omardelarosa.com',
        socials: [
            {
                name: 'LinkedIn',
                slug: 'linkedin',
                url: 'https://www.linkedin.com/in/omardelarosa',
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
        ],
        sections: [
            { name: 'projects', path: '/projects' },
            { name: 'tags', path: '/tags' },
            { name: 'process', path: '/process' },
            { name: 'about', path: '/about' },
        ],
        about: {
            text: [
                '{author} lives in Brooklyn and makes things using computers.  He works full time as a software engineer specializing in front-end web development.  His favorite tools are TypeScript and React.',
                'He\'s also quite close to finishing his M.S. in Computer Science, which he chips away in the evenings as a part-time student.  In his (limited) spare time he enjoys video games, lofi music and drawing.',
                'email: thedelarosa (a) gmail (dot) com',
            ],
        },
        projects: [
            {
                section: 'Code',
                links: [
                    {
                        name: 'Vice Uniform',
                        url: 'http://www.vice.com',
                        year: 2015,
                        description:
                            'A multi-brand publishing experience for articles and videos across the Vice properties.  Built using TypeScript, React and Express',
                    },
                    {
                        name: 'Umami',
                        url: 'http://www.grubhub.com',
                        year: 2018,
                        description:
                            'A multi-brand web application for ordering food for take out and delivery.  Built using TypeScript, Preact and Angular',
                    },
                ],
            },
            {
                section: 'Music',
                links: [
                    {
                        name: 'ioxi',
                        url: 'http://soundcloud.com/ioximusic',
                        year: 2018,
                        description:
                            'An algorithmically generated music project.',
                    },
                    {
                        name: 'Little Insects',
                        url: 'http://littleinsects.bandcamp.com',
                        year: 2008,
                        description:
                            'My lofi, bedroom indie pop projects from 2008 to 2013.',
                    },
                ],
            },
        ],
    },
    plugins: [
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/content/blog`,
                name: 'blog',
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/content/assets`,
                name: 'assets',
            },
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 590,
                        },
                    },
                    {
                        resolve: 'gatsby-remark-responsive-iframe',
                        options: {
                            wrapperStyle: 'margin-bottom: 1.0725rem',
                        },
                    },
                    {
                        resolve: 'gatsby-remark-prismjs',
                        options: {
                            // Class prefix for <pre> tags containing syntax highlighting;
                            // defaults to 'language-' (eg <pre class="language-js">).
                            // If your site loads Prism into the browser at runtime,
                            // (eg for use with libraries like react-live),
                            // you may use this to prevent Prism from re-processing syntax.
                            // This is an uncommon use-case though;
                            // If you're unsure, it's best to use the default value.
                            classPrefix: 'language-',
                            // This is used to allow setting a language for inline code
                            // (i.e. single backticks) by creating a separator.
                            // This separator is a string and will do no white-space
                            // stripping.
                            // A suggested value for English speakers is the non-ascii
                            // character '›'.
                            inlineCodeMarker: null,
                            // This lets you set up language aliases.  For example,
                            // setting this to '{ sh: "bash" }' will let you use
                            // the language "sh" which will highlight using the
                            // bash highlighter.
                            aliases: {},
                            // This toggles the display of line numbers globally alongside the code.
                            // To use it, add the following line in src/layouts/index.js
                            // right after importing the prism color scheme:
                            //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
                            // Defaults to false.
                            // If you wish to only show line numbers on certain code blocks,
                            // leave false and use the {numberLines: true} syntax below
                            showLineNumbers: false,
                            // If setting this to true, the parser won't handle and highlight inline
                            // code used in markdown i.e. single backtick code like `this`.
                            noInlineHighlight: false,
                        },
                    },
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-smartypants',
                ],
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
                trackingId: 'UA-8283504-4',
                anonymize: true,
                respectDNT: true,
            },
        },
        {
            resolve: 'gatsby-plugin-facebook-analytics',
            options: {
                appId: '1324016057659286',
                includeInDevelopment: false,
                language: 'en_US',
            },
        },
        'gatsby-plugin-feed',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Omar Delarosa\'s Website',
                short_name: 'omardelarosa.com',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#000000',
                display: 'minimal-ui',
                icon: 'content/assets/pixelpic.gif',
                include_favicon: true,
            },
        },
        'gatsby-plugin-offline',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-stylus',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-typography',
            options: {
                pathToConfigModule: 'src/utils/typography',
            },
        },
    ],
};
