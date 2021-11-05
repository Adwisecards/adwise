export default {
    root: {},

    tooltip: {
        backgroundColor: '#FFF8DC',
        padding: 20,
        border: "0.5px solid #E9DEB2",

        fontFamily: 'Atyp Display',
        fontSize: 12,
        lineHeight: '120%',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#25233E'
    },
    arrow: {
        width: 20,
        height: 15,

        '&:before': {
            border: "0.5px solid #E9DEB2",
            backgroundColor: '#FFF8DC',
        }
    },
    tooltipPlacementTop: {
        '& .MuiTooltip-arrow': {
            margin: '0 0 -15px 0!important'
        }
    },
    tooltipPlacementBottom: {
        '& .MuiTooltip-arrow': {
            margin: '-15px 0 0 0!important'
        }
    },
}
