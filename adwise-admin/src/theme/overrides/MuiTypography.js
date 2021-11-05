import palette from '../palette';

export default {
  root: {
    position: 'relative',

    '&$formTitle': {
      color: palette.text.primary,
      fontSize: 15,
      lineHeight: '18px',
      display: 'block',

      fontFamily: 'Atyp Display'
    },

    '& sup': {
      color: palette.primary.main,
      fontSize: 16,
      position: 'absolute',
      top: 0
    }
  },

  formTitle: {},
};
