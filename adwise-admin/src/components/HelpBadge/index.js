import React from "react";
import {
    Tooltip
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {

} from "react-feather";

const HelpBadge = (props) => {
    const { titleTooltip } = props;

    const classes = useStyles();

    return (
        <>

            <Tooltip title={titleTooltip}>

                <div
                    className={classes.root}
                >
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.67205 6.456H3.05205C3.05205 6.032 3.12405 5.664 3.26805 5.352C3.41205 5.032 3.58805 4.78 3.79605 4.596C4.00405 4.412 4.21205 4.244 4.42005 4.092C4.63605 3.94 4.81605 3.776 4.96005 3.6C5.10405 3.416 5.17605 3.216 5.17605 3C5.17605 2.712 5.06805 2.484 4.85205 2.316C4.64405 2.14 4.36005 2.052 4.00005 2.052C3.59205 2.052 3.27205 2.172 3.04005 2.412C2.80805 2.644 2.69205 2.976 2.69205 3.408H0.916047C0.916047 2.504 1.20005 1.792 1.76805 1.272C2.33605 0.743999 3.08005 0.479999 4.00005 0.479999C4.89605 0.479999 5.60805 0.703999 6.13605 1.152C6.66405 1.592 6.92805 2.164 6.92805 2.868C6.92805 3.276 6.84805 3.632 6.68805 3.936C6.53605 4.24 6.34805 4.484 6.12405 4.668C5.90005 4.852 5.67605 5.024 5.45205 5.184C5.22805 5.344 5.04005 5.532 4.88805 5.748C4.73605 5.956 4.66405 6.192 4.67205 6.456ZM2.88405 8.136C2.88405 7.864 2.98005 7.632 3.17205 7.44C3.36405 7.248 3.59205 7.152 3.85605 7.152C4.12805 7.152 4.36005 7.248 4.55205 7.44C4.74405 7.632 4.84005 7.864 4.84005 8.136C4.84005 8.392 4.74005 8.62 4.54005 8.82C4.34805 9.012 4.12005 9.108 3.85605 9.108C3.59205 9.108 3.36405 9.012 3.17205 8.82C2.98005 8.62 2.88405 8.392 2.88405 8.136Z" fill="#CBCCD4"/>
                    </svg>
                </div>


            </Tooltip>

        </>
    )
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: 20,
        height: 20,

        borderRadius: 999,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#50348C',

        marginLeft: 16
    }
}));

export default HelpBadge
