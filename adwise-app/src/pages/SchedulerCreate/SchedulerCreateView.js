import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar, Platform,
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {
    Page,
    HeaderControlsButtons
} from "../../components";
import {
    Form,
    ButtonEdit,
    TaskParticipants
} from './components';
import {
    Icon
} from 'native-base';
import i18n from "i18n-js";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

class SchedulerCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                name: '',
                description: '',
                date: moment().format('YYYY-MM-DD'),
                time: moment(),
                participants: []
            },

            participants: [],
            listConnections: [],

            isLoading: false,
            isButtonSaveDisabled: false
        }

        this.refForm = React.createRef();

        this.account = this.props.app.account;
        this.activeCutaway = this.props.app.activeCutaway;
    }

    componentDidMount = () => {
        this.setListConnections();

        if (!!this.props.navigation && !!this.props.navigation.state.params && !!this.props.navigation.state.params.usersList){
            let {usersList} = this.props.navigation.state.params;
            this.setState({ participants: [...usersList] });
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    setListConnections = () => {
        let listConnections = [];

        if (this.activeCutaway){
            let card = this.account.contacts.find((item) => item._id === this.activeCutaway);

            listConnections = card.contacts;
        }else{
            let card = this.account.contacts[0];

            listConnections = card.contacts;
        }

        this.setState({
            listConnections
        })
    }

    checkValidateSubmit = async () => {
        await this.setState({ isButtonSaveDisabled: true });

        const validateForm = Object.keys(await this.refForm.validateForm()).length === 0;

        if (!validateForm){
            await this.setState({ isButtonSaveDisabled: false });
        }

        await this.refForm.handleSubmit();
    }

    onSubmit = (bodyInit) => {
        let body = {...bodyInit};
        this.setState({ isLoading: true })

        let activeUser = (this.activeCutaway) ? this.activeCutaway : this.account.contacts[0]._id;

        body.participants = [...this.state.participants];
        body.contactId = activeUser;
        body.time = moment(body.time).format('HH:mm');

        axios('post', urls["create-task"], body).then((response) => {
            this.setState({
                isLoading: false,
                isButtonSaveDisabled: false
            })
            this.props.navigation.goBack()
        }).catch(error => {
            this.setState({
                isLoading: false,
                isButtonSaveDisabled: false
            })
        })
    }

    onChangeParticipants = (participants) => {
        this.setState({ participants })
    }

    render() {
        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <View style={[commonStyles.container, { paddingBottom: 0 }]}>
                    <View style={styles.form_Header}>
                        <TouchableOpacity style={styles.form_CloseButton} onPress={this.goBack}>
                            <Icon name={'arrow-left'} type={'Feather'} style={styles.form_CloseButtonIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.form_Title}>Создание задачи</Text>
                    </View>
                </View>


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={commonStyles.container}
                >
                    <Form
                        setRef={(ref) => this.refForm = ref}
                        form={this.state.form}

                        onSubmit={this.onSubmit}

                        onChangeForm={(form) => this.setState({ form })}
                    />
                    <TaskParticipants
                        myConnections={this.state.listConnections}
                        onChangeParticipants={this.onChangeParticipants}
                        activeParticipants={this.state.participants}
                    />
                </ScrollView>

                <ButtonEdit
                    isDisabled={this.state.isButtonSaveDisabled}

                    onPress={this.checkValidateSubmit}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    controlContainer: {
        marginLeft: -12,
        marginBottom: 15
    },

    form_Header: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 12
    },
    form_Title: {
        fontSize: 24,
        lineHeight: 24,
        fontFamily: 'AtypText_medium'
    },

    form_CloseButton: {
        width: 24,
        height: 26,

        marginRight: 8
    },
    form_CloseButtonIcon: {
        fontSize: 24,
        color: '#8152E4'
    },

    form_Line: {
        marginBottom: 24
    },

    formItem_Title: {
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        fontFamily: 'AtypText',
        marginBottom: 8
    }
})

export default SchedulerCreate
