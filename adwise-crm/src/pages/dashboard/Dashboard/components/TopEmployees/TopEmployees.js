import React, {useState, useEffect} from "react";
import {
    Box,

    Grid,

    Avatar,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Skeleton
} from '@material-ui/lab';
import {
    PlugsOrganizationDefaultUser
} from '../../../../../icons';
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TopEmployees = (props) => {
    const {organization} = props;
    const classes = useStyles();

    let employees = [...organization.employees];

    employees = employees.splice(0, 3);

    return (
        <Box>

            <Box className={classes.header}>
                <Typography className={classes.title}
                            dangerouslySetInnerHTML={{__html: allTranslations(localization.dashboardTopEmployeesTermsSales)}}/>
            </Box>

            <Box className={classes.body}>
                <Grid container spacing={1}>

                    {
                        employees.map((employee, idx) => (
                            <UserRow key={`employee-${idx}`} employeeId={employee}/>
                        ))
                    }

                </Grid>
            </Box>

        </Box>
    )
}

const UserRow = (props) => {
    const {employeeId} = props;
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [user, setUser] = useState();
    const classes = useStyles();

    useEffect(() => {
        handleOnLoad()
    }, []);

    if (isError) {
        return null
    }

    const handleOnLoad = () => {
        axiosInstance.get(`${urls["get-contact"]}${employeeId}`).then((response) => {
            setUser(response.data.data.contact);
            setLoading(false);
        }).catch((error) => {
            setError(true)
        })
    }

    if (isLoading) {
        return (
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
        )
    }

    const isPicture = Boolean(user.picture && user.picture.value);

    return (
        <Grid item xs={12}>
            <Box className={classes.row}>
                <Box className={classes.rowLeft}>
                    <Box className={classes.rowLogo}>
                        {
                            isPicture ? (
                                <Avatar alt="Remy Sharp" src={ user.picture.value }/>
                            ) : (
                                <PlugsOrganizationDefaultUser color={'rgb(233, 21, 123)'}/>
                            )
                        }
                    </Box>
                </Box>
                <Box className={classes.rowCenter}>
                    <Typography className={classes.rowName}>{user.firstName.value}</Typography>
                    <Typography className={classes.rowName}>{user.lastName.value}</Typography>
                </Box>
                <Box className={classes.rowRight}>
                    <Typography className={classes.rowSumma}>0 ₽</Typography>
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
}));

export default TopEmployees
