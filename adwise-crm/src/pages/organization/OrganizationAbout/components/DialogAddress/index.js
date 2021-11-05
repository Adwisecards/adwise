import React, {useEffect, useState, useRef} from "react";
import {
    Box,
    Grid,
    Radio,
    Switch,
    Button,
    Popover,
    Tooltip,
    TextField,
    RadioGroup,
    Typography,
    IconButton,
    FormControl,
    FormControlLabel, CircularProgress,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    YMaps,
    Map,
    Placemark,
    withYMaps
} from "react-yandex-maps";
import {
    ChevronLeft as ChevronLeftIcon
} from "react-feather";
import clsx from "clsx";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import OutputDay from "../../../../../icons/organization/OutputDay";
import axios from "axios";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {AddressAutocomplete} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialForm = {
    mondayFrom: "",
    mondayTo: "",
    tuesdayFrom: "",
    tuesdayTo: "",
    wednesdayFrom: "",
    wednesdayTo: "",
    thursdayFrom: "",
    thursdayTo: "",
    fridayFrom: "",
    fridayTo: "",
    saturdayFrom: "",
    saturdayTo: "",
    sundayFrom: "",
    sundayTo: "",
};

let timeoutSearchCities;

const DialogAddress = (props) => {
    const {isOpen, organization, onClose, onSave, isGlobalDisabled} = props;
    const classes = useStyles();
    const refMap = useRef();


    const [form, setForm] = useState({...initialForm});
    const [address, setAddress] = useState(organization?.placeId?.addressId || organization?.placeId);
    const [details, setDetails] = useState(organization?.addressDetails);
    const [gps, setGps] = useState(organization?.address?.coords);
    const [scrollTop, setScrollTop] = useState(0);

    const handleGetGpsPoint = () => {
        if (!isOpen || !organization?.placeId || address === organization.address?.placeId) {
            return null
        }

        axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.REACT_APP_YANDEX_KEY}&format=json&geocode=${address}`).then((res) => {
            const point = res.data.response.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos || "";
            setGps(point.split(' ').reverse());
        })
    }

    useEffect(() => {

        if (isOpen) {

            const main = document.getElementsByClassName('main')[0];
            main.style.overflow = 'hidden';

            setScrollTop(main.scrollTop);
            main.scrollTop = 0;

        }
        if (!isOpen) {

            const main = document.getElementsByClassName('main')[0];
            main.style.overflow = 'auto';

            main.scrollTop = scrollTop;

        }

    }, [isOpen]);
    useEffect(() => {

        if (organization.schedule) {
            setForm({
                mondayFrom: organization?.mondayFrom || organization?.schedule?.monday?.from,
                mondayTo: organization?.mondayTo || organization?.schedule?.monday?.to,
                tuesdayFrom: organization?.tuesdayFrom || organization?.schedule?.tuesday?.from,
                tuesdayTo: organization?.tuesdayTo || organization?.schedule?.tuesday?.to,
                wednesdayFrom: organization?.wednesdayFrom || organization?.schedule?.wednesday?.from,
                wednesdayTo: organization?.wednesdayTo || organization?.schedule?.wednesday?.to,
                thursdayFrom: organization?.thursdayFrom || organization?.schedule?.thursday?.from,
                thursdayTo: organization?.thursdayTo || organization?.schedule?.thursday?.to,
                fridayFrom: organization?.fridayFrom || organization?.schedule?.friday?.from,
                fridayTo: organization?.fridayTo || organization?.schedule?.friday?.to,
                saturdayFrom: organization?.saturdayFrom || organization?.schedule?.saturday?.from,
                saturdayTo: organization?.saturdayTo || organization?.schedule?.saturday?.to,
                sundayFrom: organization?.sundayFrom || organization?.schedule?.sunday?.from,
                sundayTo: organization?.sundayTo || organization?.schedule?.sunday?.to,
            })

        } else {
            setForm({...initialForm});
        }
    }, [isOpen]);
    useEffect(() => {
        setAddress(organization?.placeId?.addressId || organization?.placeId);
        setDetails(organization?.addressDetails);

        handleGetGpsPoint();
    }, [organization.addressDetails, organization.placeId]);
    useEffect(() => {
        handleGetGpsPoint();
    }, [address]);

    if (!isOpen) {
        return null
    }

    const handleChangeTime = ({target}) => {
        const {name, value} = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
    }
    const handleChangeOutput = (from, to, value) => {
        let newForm = {...form};

        newForm[from] = Boolean(value === 'true') ? '00:00' : '10:00';
        newForm[to] = Boolean(value === 'true') ? '23:59' : '19:00';

        setForm(newForm);
    }
    const handleChangeAroundClock = (value) => {
        let newForm = {...form};
        Object.keys(newForm).map((key) => {
            newForm[key] = value ? '00:00' : Boolean(key.indexOf('From') > -1) ? '10:00' : '19:00';
        });
        setForm(newForm);
    }
    const handleCopyAll = (from, to) => {
        let newForm = {...form};
        Object.keys(newForm).map((key) => {
            newForm[key] = Boolean(key.indexOf('From') > -1) ? from : to;
        });
        setForm(newForm);
    }
    const handleOnSave = () => {
        let newOrganization = {
            ...organization,
            ...form,
            placeId: address,
            addressDetails: details,
            addressGps: gps
        };

        if (gps) {
            newOrganization.addressGps = JSON.stringify({
                lat: gps[0],
                lon: gps[1]
            })
        }

        onSave(newOrganization);
        onClose();
    }
    const handleOnMapClick = async (event) => {
        const coords = event.get("coords");
        setGps(coords);
    }

    const handleChangeAddress = ({ target }) => {
        const { value } = target;
        setAddress(value);
    }

    const _checkAroundClock = () => {
        let aroundClock = true;
        Object.keys(form).map((key) => {
            if (form[key] !== '00:00') {
                aroundClock = false
            }
        });
        return aroundClock
    }
    const aroundClock = _checkAroundClock();

    return (
        <Box className={classes.root}>

            <Grid container spacing={3}>
                <Grid item>
                    <Tooltip title={allTranslations(localization.commonCloseWindow)} arrow>
                        <IconButton style={{width: 40, height: 40, border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: 999}} onClick={onClose}>
                            <ChevronLeftIcon color="rgba(255, 255, 255, 0.5)"/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item style={{flex: 1}}>
                    <Box width="100%" maxWidth={890} py={5} px={8} borderRadius={5} bgcolor="white">

                        <Box mb={4}>
                            <Typography variant="h2">{allTranslations(localization['organization_about.dialogAddress.title'])}</Typography>
                        </Box>

                        <Box height={280} borderRadius={5} position="relative" overflow="hidden" mb={4}>
                            <YMaps>
                                <Map
                                    instanceRef={refMap}
                                    width="100%"
                                    height="100%"
                                    defaultState={{
                                        center: (gps) ? gps : [55.75, 37.57],
                                        zoom: 9
                                    }}
                                    onClick={handleOnMapClick.bind(this)}
                                >
                                    <Placemark
                                        geometry={gps}
                                    />
                                </Map>
                            </YMaps>
                        </Box>

                        <Box mb={5}>
                            <Grid container spacing={5}>
                                <Grid item xs={6}>
                                    <Box mb={1}>
                                        <Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.addressOrganization'])}</Typography>
                                    </Box>

                                    <AddressAutocomplete
                                        name="placeId"
                                        margin="none"
                                        value={address}
                                        disabled={isGlobalDisabled}
                                        onChange={handleChangeAddress}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box mb={1}>
                                        <Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.addressOrganizationComment'])}</Typography>
                                    </Box>
                                    <TextField
                                        value={details}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Екатеринбург"
                                        onChange={({target}) => setDetails(target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mb={2}>
                            <Box mb={3}>
                                <Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.workingHours.title'])}</Typography>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.monday'])}
                                        form={form}
                                        start="mondayFrom"
                                        end="mondayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.tuesday'])}
                                        form={form}
                                        start="tuesdayFrom"
                                        end="tuesdayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.wednesday'])}
                                        form={form}
                                        start="wednesdayFrom"
                                        end="wednesdayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.thursday'])}
                                        form={form}
                                        start="thursdayFrom"
                                        end="thursdayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.friday'])}
                                        form={form}
                                        start="fridayFrom"
                                        end="fridayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.saturday'])}
                                        form={form}
                                        start="saturdayFrom"
                                        end="saturdayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                                <Grid item>
                                    <WorkHour
                                        form={form}
                                        title={allTranslations(localization['organization_about.dialogAddress.workingHours.sunday'])}
                                        start="sundayFrom"
                                        end="sundayTo"
                                        onChange={handleChangeTime}
                                        onChangeOutput={handleChangeOutput}
                                        onCopyAll={handleCopyAll}
                                    />
                                </Grid>
                            </Grid>

                        </Box>

                        <Box mb={8}>
                            <FormControlLabel
                                style={{marginLeft: 0}}
                                checked={Boolean(aroundClock)}
                                onChange={() => handleChangeAroundClock(!Boolean(aroundClock))}
                                control={<Switch checked={Boolean(aroundClock)} name="checkedA"/>}
                                label={(<Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.workingHours.aroundClock'])}</Typography>)}
                                labelPlacement="start"
                            />
                        </Box>

                        <Button variant="contained" onClick={handleOnSave}>{allTranslations(localization['organization_about.dialogAddress.workingHours.buttonSave'])}</Button>

                    </Box>
                </Grid>
            </Grid>

        </Box>
    )
}

const WorkHour = (props) => {
    const {form, title, start, end, onChange, onChangeOutput, onCopyAll} = props;
    const classes = useStyles();
    const isOutput = Boolean(form[start] === '00:00' && form[end] === '23:59');

    let from = form[start] || '—';
    let to = form[end] || '—';

    return (
        <>

            <Box className={classes.workHour}>

                <Box className={clsx({
                    [classes.workHourHeader]: true,
                    [classes.workHourHeaderOutput]: isOutput,
                })}>{title}</Box>

                <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                        <>

                            <Tooltip title={allTranslations(localization['organization_about.dialogAddress.workingHours.changeWorkTime'])} arrow>

                                <Box
                                    className={clsx({
                                        [classes.workHourBody]: true,
                                        [classes.workHourBodyOutput]: isOutput
                                    })}
                                    {...bindTrigger(popupState)}
                                >
                                    {
                                        isOutput ? (
                                            <OutputDay/>
                                        ) : (
                                            <>
                                                <div>{from}</div>
                                                <div>{to}</div>
                                            </>
                                        )
                                    }

                                </Box>
                            </Tooltip>

                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                elevation={0}
                                className={classes.workHourDialog}
                            >
                                <Box px={3} py={2} maxWidth={220}>

                                    <Box mb={2}>
                                        <RadioGroup name="gender1" value={String(isOutput)}
                                                    onChange={({target}) => onChangeOutput(start, end, target.value)}>
                                            <FormControlLabel value="false" control={<Radio color="primary"/>} label={(
                                                <Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.workingHours.workingDay'])}</Typography>)}/>
                                            <FormControlLabel value="true" control={<Radio color="primary"/>} label={(
                                                <Typography variant="formTitle">{allTranslations(localization['organization_about.dialogAddress.workingHours.dayOff'])}</Typography>)}/>
                                        </RadioGroup>
                                    </Box>

                                    {
                                        !isOutput && (
                                            <Box mb={3}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            style={{height: 32}}
                                                            variant="outlined"
                                                            placeholder="10:00"
                                                            name={start}
                                                            value={form[start]}
                                                            onChange={onChange}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            style={{height: 32}}
                                                            variant="outlined"
                                                            placeholder="19:00"
                                                            name={end}
                                                            value={form[end]}
                                                            onChange={onChange}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )
                                    }

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        style={{height: 26, fontSize: 12}}
                                        onClick={() => onCopyAll(from, to)}
                                    >{allTranslations(localization['organization_about.dialogAddress.workingHours.copyAllDays'])}</Button>

                                </Box>
                            </Popover>
                        </>
                    )}
                </PopupState>

            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        zIndex: 999,
        top: -40,
        left: -40,
        right: -40,
        bottom: -40,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 50px)',
        backgroundColor: '#9887b7',
        padding: '50px 140px'
    },

    workHour: {
        width: 60
    },
    workHourHeader: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '6px 18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#F2F3F9',
        marginBottom: 4,

        fontSize: 15,
        lineHeight: '18px',
        color: '#25233E',
        textAlign: 'center',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    workHourHeaderOutput: {
        backgroundColor: '#C4A2FC',
        color: '#FFFFFF'
    },
    workHourBody: {
        cursor: 'pointer',
        height: 50,
        width: '100%',
        boxSizing: 'border-box',
        padding: '6px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#F2F3F9',

        fontSize: 15,
        lineHeight: '18px',
        color: '#25233E',
        textAlign: 'center',
        fontFeatureSettings: "'ss03' on, 'ss06' on"

    },
    workHourBodyOutput: {
        backgroundColor: '#C4A2FC',
        color: '#FFFFFF'
    },
    workHourDialog: {
        '& .MuiPaper-root': {
            marginLeft: 8,
            boxShadow: '0px 3px 4px rgba(168, 171, 184, 0.25)'
        }
    }
}));

export default DialogAddress
