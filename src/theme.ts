import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    pearson: {
      primary: string;
      secondary: string;
      accent: string;
      accentBlue: string;
      accentGreen: string;
      accentYellow: string;
    };
  }
  interface PaletteOptions {
    pearson?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      accentBlue?: string;
      accentGreen?: string;
      accentYellow?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    pearson: {
      primary: '#5B2D86',
      secondary: '#9B5FC0',
      accent: '#5B2D86',
      accentBlue: '#0077C8',
      accentGreen: '#00A99D',
      accentYellow: '#FFD100'
    },
    primary: {
      main: '#5B2D86',
    },
    secondary: {
      main: '#9B5FC0',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `,
    },
  },
});

export default theme; 