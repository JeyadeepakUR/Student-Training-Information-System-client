export const theme = {
  colors: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    background: {
      main: '#f9fafb',
      light: '#f3f4f6',
      white: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      light: '#6b7280',
    },
    status: {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    h1: {
      fontSize: '1.875rem',
      fontWeight: '700',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: '600',
    },
    body: {
      fontSize: '0.875rem',
      fontWeight: '400',
    },
    small: {
      fontSize: '0.75rem',
      fontWeight: '400',
    },
  },
  transitions: {
    default: 'all 0.2s ease',
    hover: 'all 0.2s ease-in-out',
  },
};

export const commonStyles = {
  card: `
    background-color: ${theme.colors.background.white};
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.sm};
    padding: ${theme.spacing.lg};
  `,
  button: `
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    font-weight: 500;
    transition: ${theme.transitions.default};
    cursor: pointer;
    border: none;
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }
  `,
  input: `
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.body.fontSize};
    transition: ${theme.transitions.default};
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
  `,
  table: `
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: ${theme.spacing.md};
      text-align: left;
      border-bottom: 1px solid ${theme.colors.border.light};
    }
    th {
      background-color: ${theme.colors.background.light};
      font-weight: 500;
      color: ${theme.colors.text.secondary};
    }
    tr:hover {
      background-color: ${theme.colors.background.light};
    }
  `,
}; 