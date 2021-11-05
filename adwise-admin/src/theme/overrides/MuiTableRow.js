export default {
    root: {
        '&:nth-child(2n+1) .MuiTableCell-body': {
            backgroundColor: 'rgba(168, 171, 184, 0.07)'
        },
        '& .MuiTableCell-body': {
            '&:first-child': {
                borderRadius: '8px 0 0 8px',

            },
            '&:last-child': {
                borderRadius: '0 8px 8px 0',
            }
        },

        '&.MuiTableRow-hover': {
            "&:hover": {
                backgroundColor: 'rgba(238, 228, 254, 0.4)'
            }
        },

        '&$selected .MuiTableCell-body': {
            backgroundColor: 'rgba(196, 162, 252, 0.2)',

            '&:hover .MuiTableCell-body': {
                backgroundColor: 'rgba(196, 162, 252, 0.4)'
            }
        }
    },

    hover: {
        cursor: 'pointer'
    }
}
