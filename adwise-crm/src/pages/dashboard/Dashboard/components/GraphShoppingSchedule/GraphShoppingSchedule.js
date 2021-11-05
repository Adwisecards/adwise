import React, {useState, useEffect} from "react";
import {
    Box,
    Grid,
    Button,
    Popover,
    useTheme,
    MenuItem,
    Typography, CircularProgress, Backdrop
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import {sortObjectByKey} from "../../../../../helper/sorts";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";

const namesPeriod = {
    "week": allTranslations(localization['dashboard.periods.week']),
    "month": allTranslations(localization['dashboard.periods.month']),
    "quarter": allTranslations(localization['dashboard.periods.quarter'])
}
const filesPeriod = {
    "week": [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    "month": [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    "quarter": [moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD'), moment().quarter(moment().quarter()).endOf('quarter').format('YYYY-MM-DD')],
    "year": [moment().year(moment().year()).startOf('year').format('YYYY-MM-DD'), moment().year(moment().year()).endOf('year').format('YYYY-MM-DD')],
    "all_time": [moment().year(moment().year()).startOf('year').subtract(10, 'y').format('YYYY-MM-DD'), moment().year(moment().year()).endOf('year').format('YYYY-MM-DD')],
}

const GraphShoppingSchedule = (props) => {
    const {organizationId, purchasesInitial} = props;
    const theme = useTheme();
    const classes = useStyles();

    const [purchases, setPurchases] = useState(purchasesInitial);
    const [labels, setLabels] = useState({});
    const [period, setPeriod] = useState("week");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setPurchases(purchasesInitial);
        handleSetLabels(purchasesInitial);
    }, [purchasesInitial]);

    const handleSetLabels = (data = purchases, time = period) => {
        let labels = _getListTitles(data, time);
        setLabels(labels)
    }
    const _getListTitles = (data, period) => {
        let labels = {};
        let newLabels = {};

        switch (period) {
            case "week": {
                for (let key = 0; key < 7; key++) {
                    const date = moment().subtract(key, 'days').format('DD.MM.YYYY');
                    labels[date] = {
                        title: date,
                        items: 0
                    };
                }
                data.map((purchase) => {
                    const key = moment(purchase.timestamp).format('DD.MM.YYYY');

                    if (labels[key]) {
                        labels[key]['items']++
                    }
                });
                break;
            }
            case "month": {
                for (let key = 0; key < 31; key++) {
                    const date = moment().subtract(key, 'days').format('DD.MM.YYYY');
                    labels[date] = {
                        title: date,
                        items: 0
                    };
                }
                data.map((purchase) => {
                    const key = moment(purchase.timestamp).format('DD.MM.YYYY');

                    if (labels[key]) {
                        labels[key]['items']++
                    }
                });

                break;
            }
            case "quarter": {
                const month = moment().quarter(moment().quarter()).endOf('quarter');
                for (let key = 0; key < 3; key++) {
                    const date = moment(month).subtract(key, 'months').format('MMMM');
                    labels[date] = {
                        title: date,
                        items: 0
                    };
                }
                data.map((purchase) => {
                    const key = moment(purchase.timestamp).format('MMMM');

                    if (labels[key]) {
                        labels[key]['items']++
                    }
                });

                break;
            }
            case "year": {
                const year = moment().year(moment().year()).endOf('year');
                for (let key = 0; key < 12; key++) {
                    const date = moment(year).subtract(key, 'months').format('MMMM');
                    labels[date] = {
                        title: date,
                        items: 0
                    };
                }
                data.map((purchase) => {
                    const key = moment(purchase.timestamp).format('MMMM');

                    if (labels[key]) {
                        labels[key]['items']++
                    }
                });
            }
            // case "all_time": {}
        }

        Object.keys(labels)
            .reverse()
            .forEach((key) => {
                newLabels[key] = labels[key]
            })

        return newLabels
    }
    const handleGetSeries = () => {
        let list = [];
        Object.keys(labels).map((key) => {
            list.push(labels[key]['items'])
        })
        return list
    }

    const handleChangePeriod = async (period) => {
        setLoading(true);
        await setPeriod(period);

        const periods = filesPeriod[period];
        const urlSearch =  `?dateFrom=${ periods[0] }&dateTo=${ periods[1] }&limit=999&confirmed=true`;
        const purchases = await axiosInstance.get(`${ urls["get-purchases"] }${ organizationId }${ urlSearch }`).then((response) => {
            let purchases = response.data.data.purchases;

            purchases.sort((a, b) => {
                if (a.timestamp > b.timestamp) {
                    return 1
                }
                if (a.timestamp < b.timestamp) {
                    return -1
                }

                return 0
            })

            return purchases
        })

        setPurchases(purchases);
        setLoading(false);
        handleSetLabels(purchases, period);
    }

    const _getOptions = () => {
        return {
            chart: {
                background: theme.palette.background.paper,
                stacked: false,
                toolbar: {
                    show: false,
                },
                zoom: false,
                fontFamily: 'Atyp Display',
                parentHeightOffset: 0,
                animations: {
                    enabled: false,
                },
                width: '100%',
            },
            colors: ['#8152E4'],
            dataLabels: {
                enabled: false
            },
            grid: {
                borderColor: '#ebeef0',
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            legend: {
                show: false,
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 0,
                labels: {
                    colors: theme.palette.text.secondary
                }
            },
            markers: {
                size: 0,
                strokeColors: ['#1f87e6', '#27c6db'],
                strokeWidth: 0,
                shape: 'circle',
                radius: 2,
                hover: {
                    size: undefined,
                    sizeOffset: 2
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    opacityFrom: 0.8,
                    opacityTo: 0.8,
                    stops: [100]
                }
            },
            stroke: {
                width: 0,
                curve: 'smooth',
                lineCap: 'butt'
            },
            theme: {
                mode: theme.palette.type
            },
            tooltip: {
                theme: theme.palette.type
            },
            xaxis: {
                axisBorder: {
                    color: theme.palette.divider
                },
                axisTicks: {
                    show: true,
                    color: theme.palette.divider
                },
                categories: Object.keys(labels),
                labels: {
                    style: {
                        colors: theme.palette.text.secondary
                    }
                }
            },
            yaxis: [
                {
                    axisBorder: {
                        show: false,
                        color: theme.palette.divider
                    },
                    axisTicks: {
                        show: false,
                        color: theme.palette.divider
                    },
                    labels: {
                        style: {
                            colors: theme.palette.text.secondary
                        }
                    }
                }
            ]
        }
    }
    const _getSeries = () => {
        return [{
            name: allTranslations(localization.layoutsMainSidebarControlBills),
            data: handleGetSeries()
        }]
    }

    return (
        <Box className={classes.root} position="relative" p={3}>

            <Grid container justify="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3">{allTranslations(localization.layoutsMainSidebarControlBills)}</Typography>
                </Grid>
                <Grid item>
                    <PopupState variant="popover" popupId="demo-popup-popover">
                        {(popupState) => (
                            <div>
                                <Box style={{cursor: "pointer", width: 200, textAlign: "right", display: "flex", justifyContent: "flex-end"}} variant="text" color="primary" {...bindTrigger(popupState)}>
                                    <Typography variant="button" color="primary">{namesPeriod[period]}</Typography>
                                </Box>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    elevation={1}
                                >
                                    {
                                        Object.keys(namesPeriod).map((key) => (
                                            <MenuItem onClick={() => handleChangePeriod(key)}>{namesPeriod[key]}</MenuItem>
                                        ))
                                    }
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                </Grid>
            </Grid>

            <ReactApexChart
                options={_getOptions()}
                series={_getSeries()}
                type="area"
                width="100%"
            />

            <Backdrop open={isLoading} invisible={isLoading} style={{position: "absolute"}}>
                <CircularProgress size={60} style={{color: 'white'}}/>
            </Backdrop>

        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1
    }
}));

export default GraphShoppingSchedule
