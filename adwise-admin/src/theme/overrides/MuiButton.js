import palette from '../palette'

export default {
  root: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: '36px',
    textAlign: 'center',

    borderRadius: 6,
    padding: '6px 24px',
  },

  contained: {
    backgroundColor: '#8152E4',
    color: 'white',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#8152E4',
    },
    '&:active': {
      backgroundColor: '#8152E4',
    },
    '&$disabled': {
      backgroundColor: '#8152E4',
      color: 'white',
      opacity: 0.4,
    },
  },

  containedSecondary: {
    backgroundColor: '#EADEFE',
    color: '#966EEA',
    boxShadow: 'none',
    fontSize: 17,
    padding: '1px 16px',
    minWidth: '38px',
    textTransform: 'unset',
    fontWeight: 400,
    fontFeatureSettings: "'ss03' on, 'ss06' on",

    '&:hover': {
      backgroundColor: '#EADEFE',
    },
    '&:active': {
      backgroundColor: '#EADEFE',
    },
  },

  outlined: {
    borderColor: '#8152E4',
    color: '#8152E4',
  },

  text: {
    textTransform: 'initial',
    fontSize: 16,
    lineHeight: '19px',
    letterSpacing: '0.02em',
    fontFeatureSettings: "'ss03' on, 'ss06' on",

    color: '#8152E4'
  }
}
