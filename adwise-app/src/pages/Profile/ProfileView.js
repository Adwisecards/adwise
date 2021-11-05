import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import commonStyles from "../../theme/variables/commonStyles";
import {
    Page,
    ModalLoading,
    HeaderAccounts,
    DropDownHolder
} from "../../components";
import {
    Contacts,
    ModalForm,
    ButtonEdit
} from './components'
import {deleteItemAsync} from "../../helper/SecureStore";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import moment from "moment";
import getError from "../../helper/getErrors";
import {awaitFormatPhone} from "../../helper/format";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenModalEdit: false,
            isSubmitProcess: false,

            textLoading: '',
            typeModalEdit: '',

            modalForm: {}
        }
    }

    componentDidMount = async () => {
        await this.setUserModalForm();

        this.props.navigation.addListener('didFocus', async () => {
            await this.setUserModalForm();
        });
    }

    setUserModalForm = async () => {
        let account = {...this.props.account};
        let modalForm = {
            firstName: account.firstName,
            lastName: account.lastName,
            picture: account.picture,
            gender: account.gender,
            dob: (account.dob) ? account.dob : null,
            phone: await awaitFormatPhone(account.phone),
            email: account.email,
        }

        this.setState({ modalForm })
    }

    userExit = async () => {
        await deleteItemAsync('jwt');
        this.props.updateAccount(null);
        this.props.updateActiveCutaway('')
    }

    onOpenEdit = (type) => {
        this.setState({
            isOpenModalEdit: true,
            typeModalEdit: type
        })
    }

    onChangeModalEdit = (form) => {}
    onSubmitModalEdit = async (form) => {
        this.setState({
            isSubmitProcess: true,
            isOpenModalEdit: false,
            textLoading: allTranslations(localization.profileUpdatingContacts)
        });

        await axios('put', urls["update-user"], this.getFormSubmit(form)).then(async (response) => {
            this.setState({ textLoading: allTranslations(localization.profileDataChangedSuccessfully) })
            await this.updateUserInformation();
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({
                isSubmitProcess: false,
                textLoading: ''
            })
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        });
    }
    getFormSubmit = (form) => {
        let body = new FormData();

        for(let key in form){
            let value = form[key];

            if (value){
                if (key === 'dob'){
                    body.append('dob', moment(form.dob).format('YYYY-MM-DD'))
                }
                if (key === 'phone'){
                    body.append('phone', form.phone.replace(/\D+/g,""))
                }
                if (
                    key !== 'phone' &&
                    key !== 'dob'
                ) {
                    body.append(key, value);
                }
            }
        }

        return body
    }
    updateUserInformation = async () => {
        axios('get', urls["get-me"]).then(async (response) => {
            this.props.updateAccount(response.data.data.user);
            this.setState({
                isSubmitProcess: false,
                textLoading: ''
            });

            DropDownHolder.alert('success', 'Успешно', 'Данные успешно изменены');

            await this.setUserModalForm();
        }).catch(error => {
            const errorBody = getError(error.response)
            this.setState({
                isSubmitProcess: false,
                textLoading: ''
            })
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }

    render() {
        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={allTranslations(localization.profileHeader)} styleRoot={{marginBottom: 24}} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Contacts
                        styleRoot={{marginBottom: 32}}
                        account={this.props.account}

                        onOpenEdit={this.onOpenEdit}


                        {...this.props.account}
                        {...this.props}
                    />
                </ScrollView>

                <ButtonEdit {...this.props}/>

                <ModalForm
                    form={this.state.modalForm}

                    isOpen={this.state.isOpenModalEdit}
                    typeModalEdit={this.state.typeModalEdit}

                    onChangeModalEdit={this.onChangeModalEdit}
                    onSubmit={this.onSubmitModalEdit}
                    onClose={() => { this.setState({ isOpenModalEdit: false }) }}
                />

                <ModalLoading
                    isOpen={this.state.isSubmitProcess}
                    textLoading={this.state.textLoading}
                />
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShown: false
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    exitButton: {
        padding: 12
    },
    exitButtonText: {
        fontFamily: 'AtypText_semibold',
        fontSize: 18,
    }
})

export default Profile
