import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,

    Typography,
    Tooltip,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Tabs,
    Tab
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import clsx from "clsx";
import {formatMoney} from "../../../../../helper/format";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import alertNotification from "../../../../../common/alertNotification";


const bodyPushNotification = {
    title: '',
    message: '',
    sample: '',
    receiverIds: []
};

let timeoutSearchSamples;
let timeoutSearchUsers;

const SendPushNotification = (props) => {
    const {isOpen, onClose, samples, onSubmit} = props;

    const classes = useStyles();

    const [activeTab, setActiveTab] = useState('sample');
    const [valueAutocompleteUser, setValueAutocompleteUser] = useState('sample');
    const [usersList, setUsersList] = useState([]);
    const [isLoadingUsersList, setLoadingUsersList] = useState([]);
    const [pushNotification, setPushNotification] = useState({...bodyPushNotification});

    useEffect(() => {
        setPushNotification({...bodyPushNotification});
    }, [isOpen]);

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        let newPushNotification = {...pushNotification};
        newPushNotification[name] = value;
        setPushNotification(newPushNotification)
    }
    const handleSubmit = () => {
        let form = {...pushNotification};

        if (activeTab === 'sample') {
            delete form.receiverIds;
        }
        if (activeTab === 'users') {
            delete form.sample;
        }

        onSubmit(form)
    }

    const handleSearchUsers = async (search) => {
        setLoadingUsersList(true);

        const users = await axiosInstance(`${apiUrls["find-users"]}?pageSize=1&pageNumber=1&sortBy=timestamp&order=1&fullName=${search}`).then(res => {
            return res.data.data.users
        }).catch(() => {
            return []
        })

        setUsersList(users)
        setLoadingUsersList(false)
    }
    const handleChangeUsers = (event, user) => {
        if (Boolean(pushNotification.receiverIds.find(t => t._id === user._id))){
            alertNotification({
                title: "Системное уведомление",
                message: "Пользователь уже добавлен в выборку",
                type: "info"
            })

            return null
        }

        let newPushNotification = {...pushNotification};

        newPushNotification.receiverIds.push(user);

        setPushNotification(newPushNotification);
        setUsersList([]);
        console.log('user: ', user);
    }
    const handleDeleteUsers = (idx) => {
        let newPushNotification = {...pushNotification};
        newPushNotification.receiverIds.splice(idx, 1);

        setPushNotification(newPushNotification);
    }

    const sample = samples.find((t) => t._id === pushNotification.sample);
    const activeForm = activeTab === 'sample' ? Boolean(sample) : Boolean(pushNotification.receiverIds.length > 0)

    return (
        <Dialog
            open={isOpen}

            maxWidth="lg"
            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Создания пуш уведомления</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={4}>
                    <Box mb={2}>
                        <Tabs value={activeTab} onChange={(event, activeTab) => setActiveTab(activeTab)}>
                            <Tab value="sample" label="Выборка"/>
                            <Tab value="users" label="Пользователи"/>
                        </Tabs>
                    </Box>
                    <Box>
                        {
                            Boolean(activeTab === 'sample') && (
                                <>
                                    <Typography variant="h5">Выборка</Typography>
                                    <FormControl fullWidth margin="normal">
                                        <Select
                                            name="sample"
                                            variant="outlined"
                                            value={pushNotification.sample}
                                            onChange={handleOnChange}
                                        >
                                            <MenuItem value="">Сбросить</MenuItem>
                                            {
                                                samples.map((sample, idx) => {
                                                    return (
                                                        <MenuItem value={sample._id}>{sample.name}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <Typography variant="caption">Перед заполнение тела пуш уведомления, необходимо
                                        выбрать выборку пользователей</Typography>
                                </>
                            )
                        }
                        {
                            Boolean(activeTab === 'users') && (
                                <>
                                    <Typography variant="h5">Пользователи</Typography>
                                    <Autocomplete
                                        options={usersList}
                                        fullWidth
                                        disableClearable
                                        inputValue={valueAutocompleteUser}
                                        getOptionLabel={(option) => {
                                            return `${option?.lastName || ''} ${option?.firstName || ''} (${option._id})`
                                        }}
                                        filterOptions={(list) => {
                                            return list;
                                        }}
                                        onInputChange={(event, search, reason) => {
                                            if (reason === 'reset'){
                                                setValueAutocompleteUser('');
                                            }else{
                                                setValueAutocompleteUser(search);
                                            }

                                            clearTimeout(timeoutSearchUsers);

                                            timeoutSearchUsers = setTimeout(async () => {
                                                await handleSearchUsers(search)
                                            }, 1000);
                                        }}
                                        onChange={handleChangeUsers}
                                        loading={isLoadingUsersList}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                margin="normal"
                                            />
                                        )}
                                    />
                                    <Typography variant="caption">Перед заполнение тела пуш уведомления, необходимо
                                        выбрать пользователей</Typography>

                                    <Box mt={2}>
                                        <Grid container spacing={1}>
                                            {
                                                pushNotification.receiverIds.map((user, idx) => (
                                                    <Grid item>
                                                        <Button size="small" variant="outlined"
                                                                onClick={() => handleDeleteUsers(idx)}>{`${user?.lastName || ''} ${user?.firstName || ''}`}</Button>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Box>
                                </>
                            )
                        }
                    </Box>
                </Box>

                <Box className={clsx({
                    [classes.formDisabled]: !activeForm
                })}>
                    {
                        Boolean(activeForm) && (
                            <Box mb={2}>
                                <Typography variant="h5">~ количество
                                    пользователей {formatMoney(sample?.receivers.length || pushNotification?.receiverIds.length, '', '')}</Typography>
                            </Box>
                        )
                    }
                    <Box mb={2}>
                        <Typography variant="h5">Заголовок</Typography>
                        <TextField
                            value={pushNotification?.title}
                            placeholder="Введите заголовок"
                            variant="outlined"
                            margin="normal"
                            name="title"
                            fullWidth

                            onChange={handleOnChange}
                        />
                    </Box>
                    <Box mb={2}>
                        <Typography variant="h5">Сообщение</Typography>
                        <TextField
                            value={pushNotification?.message}
                            placeholder="Введите сообщение"
                            variant="outlined"
                            margin="normal"
                            name="message"
                            fullWidth
                            multiline
                            rows={4}
                            rowsMax={6}

                            onChange={handleOnChange}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Box px={2} py={1} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button size="small" variant="contained" onClick={handleSubmit}>Отправить пуш</Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="outlined" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>

        </Dialog>
    )
};

const useStyles = makeStyles((theme) => ({
    formDisabled: {
        position: 'relative',
        filter: 'blur(2px)',

        '&:after': {
            content: "''",
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        }
    }
}));

export default SendPushNotification
