export default {
  root: {
    "&:hover": {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(129, 82, 228, 0.3)',
      }
    },
    "&$focused": {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(129, 82, 228, 0.5)',
      }
    },
    '&$disabled': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.26)!important',
      }
    }
  },
  input: {
    padding: '8px 16px',
    fontSize: 16,
    lineHeight: '24px',
    height: 'initial',
    backgroundColor: 'white',
  },

  notchedOutline: {
    borderColor: 'rgba(168, 171, 184, 0.6)',
  },

  multiline: {
    padding: '10px 16px',
  }
};
