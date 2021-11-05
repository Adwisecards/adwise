import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    Typography, CircularProgress, Backdrop,
} from "@material-ui/core";
import {withStyles} from "@material-ui/styles";
import {
    FormFeedBack
} from "./components";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import alertNotification from "../../../common/alertNotification";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class ApplicationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                message: '',
                files: [],
                email: props.app?.account?.email || '',
                iNeedManager: false,
                packet: null
            },

            packets: [],

            isShowBackdrop: false
        }

        this.refForm = React.createRef();
    }

    componentDidMount = () => {
        this.getPackets();
    }

    getPackets = () => {
        axiosInstance.get(`${ urls["get-packets"] }`).then((response) => {
            this.setState({
                packets: response.data.data.packets
            })
        })
    }

    onChangeForm = (form) => {
        this.refForm.current.setValues(form);
    }
    onSubmit = (form) => {
        this.setState({ isShowBackdrop: true })

        const body = this.getBody(form);

        axiosInstance.post(urls['send-enrollment-request'], body).then((response) => {

            this.setState({ isShowBackdrop: false })

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.applicationFormApplicationSendSuccess),
                type: "success"
            })
        });
    }
    getBody = (form) => {
        const body = new FormData();

        body.append('packetId', form.packet);
        body.append('comment', form.message);

        form.files.map((file) => {
            body.append('files', file)
        })

        if (!!form.email) {
            body.append('email', form.email);
        }
        if (!!form.iNeedManager) {
            body.append('email', form.email);
        }

        return body
    }

    render() {
        const { form, packets } = this.state;
        const { classes } = this.props;

        return (
            <>
                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.applicationFormTitle)}</Typography>
                </Box>

                <Box maxWidth={1200}>
                    <Grid container spacing={4}>
                        <Grid item xs={7}>
                            <Box border="1px solid #CBCCD4" borderRadius={4} p={3}>
                                <FormFeedBack
                                    innerRef={this.refForm}
                                    form={form}
                                    packets={packets}

                                    onChange={this.onChangeForm}
                                    onSubmit={this.onSubmit}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            <Box maxWidth={370}>

                                <Typography className={classes.informationTitle}>{allTranslations(localization.applicationFormMessageTitle)}</Typography>
                                <Typography className={classes.informationDescription} dangerouslySetInnerHTML={{__html: allTranslations(localization.applicationFormMessageDescription)}}/>

                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

const styles = {
    root: {
        position: "relative",
        height: '100%'
    },

    containerForm: {
        border: '0.5px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 10,

        padding: 32
    },

    informationTitle: {
        fontSize: 14,
        lineHeight: '22px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1',

        fontWeight: '600'
    },
    informationDescription: {
        fontSize: 14,
        lineHeight: '22px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1'
    },

    iconAbsoluteContainer: {
        position: 'absolute',
        right: 0,
        bottom: -40
    }
};

export default withStyles(styles)(ApplicationForm)
