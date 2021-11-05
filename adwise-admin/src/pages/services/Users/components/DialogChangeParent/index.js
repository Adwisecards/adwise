import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography,
} from "@material-ui/core";
import alertNotification from "../../../../../common/alertNotification";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";

const DialogChangeParent = (props) => {
    const { isOpen, onClose, onChange } = props;

    const [code, setCode] = useState("");
    const [user, setUser] = useState({});
    const [isLoading, setLoading]= useState(false);

    useEffect(() => {
        setCode('');
        setUser({});
        setLoading(false);
    }, [isOpen]);

    const handleChangeCode = (code) => {
        setCode(code);
        setUser({});
    }
    const handleFindUser = async () => {
        setLoading(true);

        if (code.length !== 8) {
            alertNotification({
                type: "warning",
                message: "Код визитной карточки должен состоять из 2 символов"
            })

            setLoading(false);

            return null
        }

        const ref = await axiosInstance.get(`${apiUrls["get-ref"]}/${code}`).then((response) => {
            return response.data.data.ref
        })
        if (!ref || ref.mode !== 'contact') {
            alertNotification({
                type: "warning",
                message: "Недействительный код"
            })
            setLoading(false);

            return null
        }

        const contact = await axiosInstance.get(`${apiUrls["get-contact"]}/${ref.ref}`).then((response) => {
            return response.data.data.contact
        })
        if (!contact) {
            alertNotification({
                type: "warning",
                message: "Недействительный код"
            })
            setLoading(false);

            return null
        }

        const user = await axiosInstance.get(`${apiUrls["get-user"]}/${contact.ref}`).then((response) => {
            return response.data.data.user
        })
        if (!user) {
            alertNotification({
                type: "warning",
                message: "Недействительный код"
            })
            setLoading(false);

            return null
        }

        setUser(user);
        setLoading(false);
    }
    const handleSetParent = async () => {
        if (Object.keys(user).length <= 0) {
            alertNotification({
                type: "danger",
                message: "Необходимо выбрать родителя"
            })

            return null
        }

        onChange(user._id);
    }

    return (
        <Dialog
            fullWidth
            open={isOpen}
            maxWidth="md"
        >
            <DialogTitle>
                <Typography variant="h3">Изменения родителя</Typography>
            </DialogTitle>

            <DialogContent>

                <Box>
                    <Grid container spacing={2}>
                        <Grid item style={{flex: 1}}>
                            <Typography variant="formTitle">Код визитной карточки</Typography>

                            <TextField
                                value={code}
                                fullWidth
                                type="number"
                                margin="normal"
                                placeholder="012345678"
                                variant="outlined"
                                onChange={({target}) => handleChangeCode(target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Box mb={2}><Typography variant="formTitle">&nbsp;</Typography></Box>
                            <Button onClick={handleFindUser} style={{height: 40}} variant="contained" size="small">Найти пользователя</Button>
                        </Grid>
                    </Grid>
                </Box>

                {
                    isLoading && (
                        <Box mt={2}>
                            <Typography variant="h5">Идет загрузка пользователя... Ожидайте</Typography>
                        </Box>
                    )
                }

                {
                    Boolean(Object.keys(user).length > 0) && (
                        <Box mt={2}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <img
                                        src={user?.contacts[0]?.picture.value}
                                        style={{width: 60, height: 60, borderRadius: 999}}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4">{user?.lastName}</Typography>
                                    <Typography variant="h4">{user?.firstName}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }

            </DialogContent>

            <DialogActions>
                <Box px={2} width="100%">
                    <Grid container spacing={2}>
                        <Grid item>
                            <Tooltip title="Заменить родителя пользовател">
                                <Button variant="contained" size="small" onClick={handleSetParent}>Заменить</Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DialogChangeParent
