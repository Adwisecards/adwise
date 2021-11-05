import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import overrides from './overrides';
import typography from './typography';

const theme = createMuiTheme({
  palette,
  overrides,
  typography
});

export default theme;
