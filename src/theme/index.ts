import { createTheme, alpha } from '@mui/material/styles';

/**
 * Enterprise TPM Control Tower theme.
 * Restrained navy/slate system — color reserved for RAG/status.
 */
const NAVY = '#0B3A53';
const SLATE = '#1A2B36';
const MUTED = '#5B6B76';
const BORDER = '#D5DEE6';
const SURFACE = '#F5F7F9';
const PAPER = '#FFFFFF';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: NAVY,
      light: '#1A5A78',
      dark: '#072A3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2F6B57',
      light: '#4A8A72',
      dark: '#214C3D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: SURFACE,
      paper: PAPER,
    },
    text: {
      primary: SLATE,
      secondary: MUTED,
    },
    divider: BORDER,
    success: {
      main: '#1F6B45',
      light: '#E7F3EC',
      dark: '#145233',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#A86810',
      light: '#FBF1E0',
      dark: '#7A4B0B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B42318',
      light: '#F8E9E8',
      dark: '#8A1A12',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#175C8A',
      light: '#E8F1F7',
      dark: '#0F4263',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#F8FAFB',
      100: '#EEF2F5',
      200: BORDER,
      300: '#B7C4CF',
      400: '#8A9BA8',
      500: MUTED,
      600: '#3E4F5A',
      700: '#2A3A45',
      800: SLATE,
      900: '#0F1A22',
    },
    action: {
      hover: alpha(NAVY, 0.04),
      selected: alpha(NAVY, 0.08),
      focus: alpha(NAVY, 0.12),
      disabled: alpha(SLATE, 0.3),
      disabledBackground: alpha(SLATE, 0.06),
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    fontFamilyMonospace: '"IBM Plex Mono", "Courier New", monospace',
    htmlFontSize: 16,
    h1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
      color: SLATE,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
      color: SLATE,
    },
    h3: {
      fontSize: '1.0625rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.35,
      color: SLATE,
    },
    h4: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.35,
      color: SLATE,
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: SLATE,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: '0.01em',
      color: MUTED,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: SLATE,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.45,
      color: SLATE,
    },
    caption: {
      fontSize: '0.6875rem',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      color: MUTED,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      color: MUTED,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: SURFACE,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(MUTED, 0.45)} transparent`,
        },
        '*:focus-visible': {
          outline: `2px solid ${alpha(NAVY, 0.45)}`,
          outlineOffset: 2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${BORDER}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56,
          '@media (min-width:600px)': {
            minHeight: 56,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 5,
          minHeight: 32,
          paddingInline: 12,
        },
        sizeSmall: {
          minHeight: 28,
          paddingInline: 10,
          fontSize: '0.75rem',
        },
        outlined: {
          borderColor: BORDER,
          '&:hover': {
            borderColor: alpha(NAVY, 0.35),
            backgroundColor: alpha(NAVY, 0.03),
          },
        },
        text: {
          color: MUTED,
          '&:hover': {
            backgroundColor: alpha(NAVY, 0.04),
            color: SLATE,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&:hover': {
            backgroundColor: alpha(NAVY, 0.06),
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        outlined: {
          borderColor: BORDER,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(BORDER, 0.9),
          padding: '8px 12px',
          fontSize: '0.8125rem',
          lineHeight: 1.35,
        },
        head: {
          fontWeight: 600,
          fontSize: '0.6875rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          backgroundColor: '#F8FAFB',
          color: MUTED,
          padding: '8px 12px',
          whiteSpace: 'nowrap',
          borderBottom: `1px solid ${BORDER}`,
        },
        sizeSmall: {
          padding: '6px 10px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: alpha(NAVY, 0.025),
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
          '&:hover': {
            color: SLATE,
          },
          '&.Mui-active': {
            color: SLATE,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          height: 22,
          fontSize: '0.6875rem',
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.6875rem',
        },
        label: {
          paddingInline: 8,
        },
        outlined: {
          borderColor: BORDER,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 400,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: SLATE,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 10px',
          borderRadius: 4,
          maxWidth: 280,
          lineHeight: 1.4,
        },
        arrow: {
          color: SLATE,
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: PAPER,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(NAVY, 0.35),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: NAVY,
          },
        },
        notchedOutline: {
          borderColor: BORDER,
        },
        input: {
          fontSize: '0.8125rem',
          paddingTop: 8.5,
          paddingBottom: 8.5,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          minHeight: 36,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 999,
          backgroundColor: alpha(NAVY, 0.08),
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: BORDER,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          textUnderlineOffset: 2,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.65rem',
          minWidth: 16,
          height: 16,
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
