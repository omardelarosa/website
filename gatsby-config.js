const DEFAULT_PROJECT_FIELDS = {
    youTubeEmbed: null,
    imageKey: null,
    imageUrl: null,
};

module.exports = {
    siteMetadata: {
        title: "Omar Delarosa",
        author: "Omar Delarosa",
        authorSocials: {
            twitter: "omardelarosa",
            instagram: "omdel",
        },
        description: "The website of Omar Delarosa",
        siteUrl: "https://www.omardelarosa.com",
        socials: [
            {
                name: "LinkedIn",
                slug: "linkedin",
                url: "https://www.linkedin.com/in/omardelarosa",
                text: "Add me on LinedIn",
            },
            {
                name: "Github",
                slug: "github",
                url: "https://github.com/omardelarosa",
                text: "Follow me on Github",
            },
            {
                name: "Tumblr",
                slug: "tumblr",
                url: "https://omardelarosa.tumblr.com",
                text: "Follow me on Tumblr",
            },
            {
                name: "Twitter",
                slug: "twitter",
                url: "https://twitter.com/omardelarosa",
                text: "Follow me on Twitter",
            },
        ],
        sections: [
            { name: "projects", path: "/projects" },
            { name: "tags", path: "/tags" },
            { name: "music", path: "/tags/music" },
            { name: "about", path: "/about" },
        ],
        about: {
            text: [
                "{author} lives in Brooklyn and makes things using computers and works as a software engineer.",
                "In his (limited) spare time he enjoys video games, lofi music and making pixelart.",
                "email: thedelarosa (a) gmail (dot) com",
            ],
        },
        projects: [
            {
                section: "Professional",
                links: [
                    {
                        name: "ML Home at Spotify",
                        url: "https://engineering.atspotify.com/2022/01/product-lessons-from-ml-home-spotifys-one-stop-shop-for-machine-learning/",
                        year: 2021,
                        description: "A developer portal for machine learning practicioners and data scientists at Spotify",
                        imageKey: "SPOTIFY"  
                    },
                    {
                        name: "Umami",
                        url: "https://www.grubhub.com",
                        year: 2018,
                        description:
                            "A multi-brand web application for ordering food for take out and delivery.  Built using TypeScript, Preact and Angular",
                        imageKey: "SEAMLESS",
                    },
                    {
                        name: "Vice Uniform",
                        url: "https://www.vice.com",
                        year: 2015,
                        description:
                            "A multi-brand publishing experience for articles and videos across the Vice properties.  Built using TypeScript, React and Express",
                        imageKey: "VICE",
                    },
                ],
            },
            {
                section: "Academic",
                links: [
                    {
                        ...DEFAULT_PROJECT_FIELDS,
                        name: "RLBrush",
                        year: 2020,
                        url: "https://rlbrush.app",
                        description:
                            "The final project for grad-level AI for games class, RLBrush level-editing tool for human-AI co-creation powered by RL models and TensorFlow.",
                        imageUrl:
                            "https://github.com/omardelarosa/pcgrl-brush/raw/master/docs/full_ui_example3_rl_brush.png",
                    },
                    {
                        ...DEFAULT_PROJECT_FIELDS,
                        name: "Infinity Terrain",
                        year: 2019,
                        url:
                            "/posts/infinity-terrain-in-c++-using-perlin-noise-and-opengl",
                        description:
                            "The final project for grad-level Computer Graphics class, this is a proposed system for real-time rendering of infinite terrain using OpenGL and C++",
                        imageKey: "INFINITY_TERRAIN",
                    },
                    {
                        ...DEFAULT_PROJECT_FIELDS,
                        name: "Moonspore Hollow",
                        year: 2019,
                        url: "/posts/devlog-1-moonspore-hollow",
                        description:
                            "A 2D ActionRPG game project started in Unity Engine, continued in Godot engine.",
                        imageKey: "MOONSPORE_HOLLOW",
                    },
                    {
                        name: "Ideation & Prototyping",
                        year: 2019,
                        url: "/process",
                        description:
                            "A class I participated in in Spring of 2019 at NYU Tandon while earning my Masters in Computer Science.  This challenged me make a prototype of a 2D game and log my process.",
                        imageKey: null,
                        youTubeEmbed: null,
                    },
                    {
                        ...DEFAULT_PROJECT_FIELDS,
                        name: "CityLens",
                        year: 2019,
                        url: "/tags/citylens",
                        description:
                            "An prototype for an Augmented Reality system for MTA subway announcements that runs entirely in the browser.  Uses Three.js and JSARToolkit.",
                        youTubeEmbed:
                            "https://www.youtube.com/embed/QVppPxScGUE",
                    },
                ],
            },

            {
                section: "Tech Talks",
                links: [
                    {
                        name: "Mixed-Initiative Level Design with RL Brush",
                        url: "https://www.youtube.com/watch?v=PYND8m_36dE&t=1s",
                        year: 2021,
                        description:
                            "Presenting a paper I wrote for EvoStar 2021 about using RL in PCG based on a paper with the same title.",
                        imageKey: "EVOSTAR",
                    },
                    {
                        name: "Making Self-Generating Hip Hop in JS",
                        url: "https://markov-music.now.sh/#1",
                        year: 2018,
                        description:
                            "A talk about how to make self-generating hip hop beats using markov chaining using WebAudio API and JavaScript",
                        imageKey: "MARKOV_MUSIC",
                    },
                    {
                        name: "TypeScript as a Build Tool",
                        url: "https://typescript-as-build-tool.now.sh",
                        year: 2018,
                        description:
                            "A talk I gave about using TypeScript as your primary build tool for an entire project after the changes from TypeScript 3.0 came out.",
                        imageUrl:
                            "https://sdtimes.com/wp-content/uploads/2019/08/typescriptfeature-490x305.png",
                    },
                ],
            },
            {
                section: "Music",
                links: [
                    {
                        name: "ioxi",
                        url: "http://soundcloud.com/ioximusic",
                        year: 2018,
                        description:
                            "An algorithmically generated music project.",
                        imageKey: "IOXI",
                    },
                    {
                        name: "Little Insects",
                        url: "http://littleinsects.bandcamp.com",
                        year: 2008,
                        description:
                            "My lofi, bedroom indie pop projects from 2008 to 2013.",
                        imageUrl:
                            "https://f4.bcbits.com/img/a2563479546_16.jpg",
                    },
                ],
            },
        ],
    },
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/content/blog`,
                name: "blog",
                ignore: [`${__dirname}/content/blog/__untitled__`]
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/content/assets`,
                name: "assets",
            },
        },
        // // TODO:
        // {
        //     resolve: 'gatsby-source-filesystem',
        //     options: {
        //         path: `${__dirname}/content/media`,
        //         name: 'media',
        //     },
        // },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 590,
                        },
                    },
                    {
                        resolve: "gatsby-remark-responsive-iframe",
                        options: {
                            wrapperStyle: "margin-bottom: 1.0725rem",
                        },
                    },
                    {
                        resolve: "gatsby-remark-prismjs",
                        options: {
                            // Class prefix for <pre> tags containing syntax highlighting;
                            // defaults to 'language-' (eg <pre class="language-js">).
                            // If your site loads Prism into the browser at runtime,
                            // (eg for use with libraries like react-live),
                            // you may use this to prevent Prism from re-processing syntax.
                            // This is an uncommon use-case though;
                            // If you're unsure, it's best to use the default value.
                            classPrefix: "language-",
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
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-smartypants",
                ],
            },
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: "UA-8283504-4",
                anonymize: true,
                respectDNT: true,
            },
        },
        {
            resolve: "gatsby-plugin-facebook-analytics",
            options: {
                appId: "1324016057659286",
                includeInDevelopment: false,
                language: "en_US",
            },
        },
        // "gatsby-plugin-feed",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "Omar Delarosa's Website",
                short_name: "omardelarosa.com",
                start_url: "/",
                background_color: "#ffffff",
                theme_color: "#000000",
                display: "minimal-ui",
                icon: "content/assets/pixelpic.gif",
                include_favicon: true,
            },
        },
        "gatsby-plugin-remove-serviceworker",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-stylus",
        "gatsby-plugin-sitemap",
        {
            resolve: "gatsby-plugin-typography",
            options: {
                pathToConfigModule: "src/utils/typography",
            },
        },
    ],
};
