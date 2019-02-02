import Typography from 'typography';
import Theme from 'typography-theme-kirkham';

Theme.overrideThemeStyles = () => {
    return {
        'a.gatsby-resp-image-link': {
            boxShadow: 'none',
        },
        'h1,h2,h3': {
            fontFamily: 'Roboto Slab, serif',
            // textTransform: 'lowercase',
            // fontSize: '2.5em',
            // textAlign: 'center',
        },
        'nav a': {
            fontFamily: 'Roboto Slab, serif',
        },
        // 'h2,h3': {
        //     fontFamily: ['Roboto', 'Open Sans', 'sans-serif'].join(', '),
        // },
    };
};

Theme.googleFonts = [
    {
        name: 'Roboto',
        styles: ['700'],
    },
    {
        name: 'Press Start 2P',
        styles: [],
    },
    {
        name: 'Roboto Slab',
        styles: [],
    },
];

const typography = new Typography(Theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
    typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
