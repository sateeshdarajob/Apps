import { createTheme } from '@mui/material/styles';

/**
 * Enterprise TPM Control Tower theme.
 * Navy / teal / slate palette — professional engineering dashboard look.
 */
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B3A53',
      light: '#1A5A78',
      dark: '#072A3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3D8B6E',
      light: '#5AA88A',
      dark: '#2C6A53',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2B36',
      secondary: '#5A6B76',
    },
    divider: '#D8E1E8',
    success: {
      main: '#2E7D4F',
      light: '#E8F5EE',
    },
    warning: {
      main: '#C47A11',
      light: '#FFF4E5',
    },
    error: {
      main: '#C62828',
      light: '#FDECEA',
    },
    info: {
      main: '#1565A0',
      light: '#E3F2FD',
    },
    grey: {
      50: '#F8FAFB',
      100: '#EEF2F5',
      200: '#D8E1E8',
      300: '#B8C5CF',
      400: '#8A9BA8',
      500: '#5A6B76',
      600: '#3E4F5A',
      700: '#2A3A45',
      800: '#1A2B36',
      900: '#0F1A22',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    fontFamilyMonospace: '"IBM Plex Mono", "Courier New", monospace',
    h1: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.125rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    h5: { fontSize: '0.9375rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.45 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4F7F9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #D8E1E8',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #D8E1E8',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #D8E1E8',
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: '#F8FAFB',
            color: '#3E4F5A',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontFamilyMonospace: string;
  }

  interface TypographyVariantsOptions {
    fontFamilyMonospace?: string;
  }
}
