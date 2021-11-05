import React, {useState, useEffect} from "react";
import {
    Box, Button,

    Grid,

    Typography
} from '@material-ui/core';
import {
    Skeleton
} from '@material-ui/lab';
import {
    makeStyles
} from '@material-ui/styles';
import axiosInstance from "../../../../../agent/agent";
import {useHistory} from 'react-router-dom';
import {
    PayRound
} from '../../../../../icons';
import urls from "../../../../../constants/urls";
import prettify from '../../../../../utils/prettifyNumber'
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const RecentTransactions = (props) => {
    const {organization} = props;
    const classes = useStyles();
    const history = useHistory();
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    useEffect(() => {
        handleOnLoad()
    }, []);

    if (isError) {
        return null
    }

    const handleOnLoad = () => {
        axiosInstance.get(`${urls["get-operations"]}${organization._id}?limit=3&page=1`).then((response) => {
            setPurchases(response.data.data.operations.splice(0, 3));
            setLoading(false);
        }).catch((error) => {
            setError(true)
        })
    }

    const handleGoToAllOperations = () => {
        history.push(`/operations`);
    }

    return (
        <Box>

            <Box className={classes.header}>
                <Grid container alignItems="flex-end" justify="space-between">
                    <Grid item>
                        <Typography className={classes.title}
                                    dangerouslySetInnerHTML={{__html: allTranslations(localization.dashboardRecentTransactions)}}/>
                    </Grid>
                    <Grid item>
                        <Button variant="text" className={classes.buttonEdit} onClick={handleGoToAllOperations}>
                            {allTranslations(localization.dashboardAllOperations)}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box className={classes.body}>
                <Grid container spacing={1}>

                    {
                        isLoading ? (
                            <Grid item xs={12}>
                                <Box className={classes.row}>
                                    <Box className={classes.rowLeft}>
                                        <Box className={classes.rowLogo}>
                                            <Skeleton width={40} height={40} variant="circle"/>
                                        </Box>
                                    </Box>
                                    <Box className={classes.rowCenter}>
                                        <Typography className={classes.rowName}><Skeleton width={100}/></Typography>
                                        <Typography className={classes.rowName}><Skeleton width={80}/></Typography>
                                    </Box>
                                    <Box className={classes.rowRight}>
                                        <Typography className={classes.rowSumma}><Skeleton width={100}/></Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ) : (
                            purchases.map((purchase) => (
                                <PurchasesRow key={`purchase-${purchase._id}`} data={purchase}/>
                            ))
                        )
                    }
                </Grid>
            </Box>

        </Box>
    )
}

const PurchasesRow = ({data}) => {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <Box className={classes.row}>
                <Box className={classes.rowLeft}>
                    <Box className={classes.rowLogo}>
                        <PayRound/>
                    </Box>
                </Box>
                <Box className={classes.rowCenter}>
                    <Typography className={classes.rowName}>{allTranslations(localization.commonInAppPurchase)}</Typography>
                </Box>
                <Box className={classes.rowRight}>
                    <Typography className={classes.rowSumma}>
                        { formatMoney(data.sum, 2, '.') } { currency.rub }
                    </Typography>
                </Box>
            </Box>
        </Grid>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {},

    header: {
        marginBottom: 12
    },

    body: {},

    title: {
        fontSize: 16,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    row: {
        display: 'flex',
        alignItems: 'center',

        padding: '8px 12px',

        backgroundColor: 'rgba(168, 171, 184, 0.07)',
        borderRadius: 8,

        '& svg': {
            width: '100%',
            height: '100%'
        }
    },
    rowLeft: {},
    rowLogo: {
        width: 40,
        height: 40,
        borderRadius: '100%',
        overflow: 'hidden',
        backgroundColor: 'white'
    },
    rowCenter: {
        flex: 1,

        marginLeft: 12,
        marginRight: 12
    },
    rowName: {
        fontSize: 14,
        lineHeight: '17px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    rowRight: {},
    rowSumma: {
        fontSize: 19,
        lineHeight: '22px',
        textAlign: 'right',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        [theme.breakpoints.between(0, 1549)]: {
            fontSize: 16,
        },
    },


    buttonEdit: {
        fontSize: 14,
        lineHeight: '17px',
        fontWeight: 'normal',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        padding: 0
    },
}));

export default RecentTransactions
