export default {
    root: {},

    ul: {
        '& .MuiPaginationItem-page': {
            borderRadius: 5,
            backgroundColor: '#EADEFE',

            fontSize: 13,
            lineHeight: '13px',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'ss03' on, 'ss06' on",
            color: '#966EEA',

            '&:hover': {
                backgroundColor: '#8152E4',
                color: 'white'
            }
        },
        '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#8152E4',
            color: 'white'
        },

    }
}