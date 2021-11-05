import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Typography,
    Box,
    Grid,
    TextField,
    Button,
} from "@material-ui/core";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    HelpBadge
} from "../../../../../components";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import alertNotification from "../../../../../common/alertNotification";

const DialogReferralChange = (props) => {
    const { isOpen, onClose, onChangeParent } = props;

    const [userReferee, setUserReferee] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [organizationId, setOrganizationId] = useState('');
    const [userReferral, setUserReferral] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [parent, setParent] = useState(null);
    const [isShowReferee, setShowReferee] = useState(false);
    const [isShowInformation, setShowInformation] = useState(false);
    const [reason, setReason] = useState("");
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        setUserReferee(null);
        setOrganization(null);
        setUserReferral(null);
        setShowInformation(false);
        setShowReferee(false);
        setUsers([]);
        setOrganizations([]);
    }, [isOpen]);
    useEffect(() => {
        if (!!organization && !!userReferee) {
            (async () => {
                await onLoadReferee();
            })();
        }
    }, [organization, userReferee])

    const onChangeUsers = async (event, search) => {
        if (!search) {
            return null
        }

        const filter = [
            'pageNumber=1',
            'pageSize=20',
            'sortBy=firstName',
            'order=1'
        ];

        const users = await axiosInstance.get(`${ apiUrls["find-subscriptions"] }?${ filter.join('&') }&organization=${organization?._id}&subscriber=${search}`).then((res) => {
            return res.data.data.subscriptions
        }).catch(() => {
            return []
        });

        setUsers(users);
    }
    const onChangeOrganizations = async (event, search) => {
        if (!search) {
            return null
        }

        const filter = [
            'pageNumber=1',
            'pageSize=20',
            'sortBy=firstName',
            'order=1',
            `_id=${ search }`
        ];
        const organizations = await axiosInstance.get(`${ apiUrls["find-organizations"] }?${ filter.join('&') }`).then((res) => {
            return res.data.data.organizations
        }).catch(() => {
            return []
        });

        setOrganizations(organizations)
    }

    const onSetOrganization = (event, value) => {
        setOrganization(value || null);
        setOrganizationId(value._id || '');
    }
    const onSetUserReferee = (event, value) => {
        setUserReferee(value || null);
    }
    const onLoadReferee = async () => {
        const subscription = await axiosInstance.get(`${ apiUrls["find-subscriptions"] }?pageSize=1&pageNumber=1&sortBy=timestamp&order=1&organization=${organization?._id}&subscriber=${userReferee?.parent?.subscriber}`).then((response) => {
            return response.data.data.subscriptions[0]
        }).catch((error) => {
            return null
        });

        if (!subscription) {
            alertNotification({
                title: 'Системное уведомление',
                message: 'Подписка не найдена',
                type: 'danger'
            })

            return null
        }

        const parent = await axiosInstance.get(`${ apiUrls["find-users"] }?pageSize=1&pageNumber=1&sortBy=timestamp&order=1&_id=${ subscription?.parent?.subscriber }`).then((res) => {
            return res.data.data.users[0]
        })

        setParent(parent);
        setSubscription(subscription);
        setShowInformation(true);
    }

    const onSetUserReferral = (event, value) => {
        setUserReferral(value || null)
    }

    const onSubmit = async () => {
        onChangeParent({
            subscription: subscription,
            parent: parent,
            userReferral: userReferral,
            reason
        })
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="md"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создание запроса на смену рекомендателя</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>
                    <Box mb={2}>
                        <Grid container spacing={0} alignItems="center">
                            <Grid item>
                                <Typography variant="h4">Организация</Typography>
                            </Grid>
                            <Grid item>
                                <HelpBadge titleTooltip="Организация на которую будет подписан реферал под рекомендатель"/>
                            </Grid>
                        </Grid>

                        <Autocomplete
                            options={organizations}
                            fullWidth
                            disableClearable
                            getOptionLabel={(option) => {
                                return `${ option?.name }`
                            }}
                            filterOptions={(list) => {
                                return list;
                            }}
                            onInputChange={onChangeOrganizations}
                            onChange={onSetOrganization}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    margin="normal"
                                />
                            )}
                        />
                    </Box>
                    <Box mb={2}>

                        <Grid container spacing={0} alignItems="center">
                            <Grid item>
                                <Typography variant="h4">Реферал</Typography>
                            </Grid>
                            <Grid item>
                                <HelpBadge titleTooltip="Кто подписывается"/>
                            </Grid>
                        </Grid>

                        <Autocomplete
                            disabled={!organization}
                            options={users}
                            loadMoreItems
                            disableClearable
                            getOptionLabel={(option) => {
                                return `${ option.subscriber?.firstName || '' } ${ option.subscriber?.lastName || ''}`
                            }}
                            filterOptions={(list) => {
                                return list;
                            }}
                            onInputChange={(event, value) => onChangeUsers(event, value, organization)}
                            onChange={onSetUserReferee}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    margin="normal"
                                />
                            )}
                        />

                        {
                            !organization && (
                                <Typography variant="caption">Выберите организацию</Typography>
                            )
                        }

                    </Box>
                    {
                        (!isShowReferee && isShowInformation) && (
                            <Box>
                                <Box mb={1}>
                                    <Typography variant="h5">В организации "{ organization?.name || '' }" у пользователь "{`${ userReferee?.subscriber?.firstName || '' } ${ userReferee?.subscriber?.lastName || '' }`}" рекомендатель "{ `${ parent?.firstName || '' } ${ parent?.lastName || '' }` }"</Typography>
                                </Box>

                                <Button variant="contained" size="small" style={{ padding: '0px 12px' }} onClick={() => setShowReferee(true)}>
                                    Изменить рекомендателя
                                </Button>
                            </Box>
                        )
                    }
                </Box>

                {
                    isShowReferee && (
                        <>

                            <Box mb={2}>
                                <Grid container spacing={0} alignItems="center">
                                    <Grid item>
                                        <Typography variant="h4">Рекомендатель</Typography>
                                    </Grid>
                                    <Grid item>
                                        <HelpBadge titleTooltip="Родитель"/>
                                    </Grid>
                                </Grid>

                                <Autocomplete
                                    options={users}
                                    fullWidth
                                    disableClearable
                                    filterOptions={(list) => {
                                        return list;
                                    }}
                                    getOptionLabel={(option) => {
                                        return `${ option.subscriber?.firstName || '' } ${ option.subscriber?.lastName || ''}`
                                    }}
                                    onInputChange={onChangeUsers}
                                    onChange={onSetUserReferral}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Box>

                            <Box mb={2}>
                                <Grid container spacing={0} alignItems="center">
                                    <Grid item>
                                        <Typography variant="h4">Комментарий</Typography>
                                    </Grid>
                                    <Grid item>
                                        <HelpBadge titleTooltip="Комментарий об смене реферала"/>
                                    </Grid>
                                </Grid>
                                <TextField
                                    value={reason}
                                    placeholder="Комментарий"
                                    variant="outlined"
                                    margin="normal"
                                    rows={4}
                                    rowsMax={6}
                                    multiline
                                    fullWidth

                                    onChange={({target}) => setReason(target.value)}
                                />
                            </Box>

                        </>
                    )
                }

            </DialogContent>

            <DialogActions>
                <Box px={2} pb={2} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!userReferee || !organization || !userReferral || !reason}
                                onClick={onSubmit}
                            >Изменить реферала</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={onClose}>Отмена</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

export default DialogReferralChange

