import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#25233E';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: colors.indigo[900],
    main: '#8152E4',
    light: colors.indigo[100],
    hover: '#8152E4'
  },
  secondary: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue['A400'],
    light: colors.blue['A400']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: black,
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  background: {
    default: '#F4F6F8',
    paper: white
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200],

  gray: {
    default: '#8698B1',
    light: '#C2CFE0',
    veryLight: '#F3F5F9',
    dark: '#647083'
  }
};
