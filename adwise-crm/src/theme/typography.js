import palette from './palette';

export default {
  h1: {
    color: palette.text.primary,
    fontWeight: 'normal',
    fontSize: 40,
    lineHeight: '48px',
  },
  h2: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '26px',
    letterSpacing: '-0.24px',
    lineHeight: '28px'
  },
  h3: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '22px',
    letterSpacing: '0.02em',
    lineHeight: '26px',
    fontFeatureSettings: "'ss03' on, 'ss06' on"
  },
  h4: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '20px',
    letterSpacing: '-0.06px',
    lineHeight: '24px'
  },
  h5: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '18px',
    letterSpacing: '-0.05px',
    lineHeight: '20px',
    fontFeatureSettings: "'ss01' on"
  },
  h6: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '20px'
  },
  subtitle1: {
    color: palette.text.primary,
    fontSize: '16px',
    lineHeight: '24px'
  },
  subtitle2: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: '500',
    letterSpacing: '0.02em',
    color: '#A8ABB8',
    fontFeatureSettings: "'ss03' on, 'ss06' on"
  },
  body1: {
    color: palette.text.primary,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '21px'
  },
  body2: {
    //
    color: '#9FA3B7',
    //color: palette.text.secondary,
    letterSpacing: '0.02px',
    fontFeatureSettings: "'ss03' on, 'ss06' on",
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
  },
  button: {
    color: palette.text.primary,
    fontSize: '14px'
  },
  caption: {
    color: palette.text.secondary,
    fontSize: '11px',
    letterSpacing: '0.33px',
    lineHeight: '13px'
  },
  overline: {
    color: palette.text.secondary,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.33px',
    lineHeight: '13px',
    textTransform: 'uppercase'
  },

  formTitle: {},
  paginationTitle: {},
  modalTitle: {},

  fontFamily: ['Atyp Display'].join(','),
};
