export default {
  // root: {
  //   borderRadius: '6px',
  //   padding: '9px 24px',
  // },
  root: {
    minWidth: 'initial',
    minHeight: 40,

    padding: '8px 32px',

    '&$selected': {
      backgroundColor: '#FFFFFF',

      boxShadow: '0px 3.6px 4.8px rgba(168, 171, 184, 0.25)',

      borderRadius: 6,

      fontWeight: '500',
    },
  },
  wrapper: {
    flexDirection: 'row',
  },
}
