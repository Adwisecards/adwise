export default {
    root: {
        padding: 8,

        '&$checked': {
            '& + .MuiSwitch-track': {
                opacity: '1!important',
                backgroundColor: '#8152E4'
            }
        }
    },

    track: {
        borderRadius: 15
    },
}
