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
    '&$paginationTitle': {
      color: '#25233E',
      fontSize: 20,
      lineHeight: '24px',
      fontFamily: 'Atyp Display',

      '& span': {
        color: '#8152E4',
        fontWeight: '500'
      }
    },
    '&$modalTitle': {
      color: '#25233E',
      fontSize: 24,
      lineHeight: '29px',
      fontWeight: '500',
      letterSpacing: '0.02em',
      fontFeatureSettings: "'ss03' on, 'ss06' on",
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
  paginationTitle: {},
  modalTitle: {},
};
