import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import {
    Page,
    ModalLoading,
    HeaderAccounts
} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import {
    Form
} from './components'
import { captureRef } from 'react-native-view-shot';
import moment from "moment";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";


class ProfileEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                firstName: '',
                lastName: '',
                picture: '',
                gender: '',
                dob: ''
            },

            imageLoadUser: null,

            isLoadingForm: true,
            isLoadingSubmit: false,
        };

        this.refImageUpload = React.createRef();
    }

    componentDidMount = () => {
        this.initForm()
    }

    initForm = () => {
        let account = {...this.props.account};
        let form = {
            firstName: account.firstName,
            lastName: account.lastName,
            picture: account.picture,
            gender: account.gender,
            dob: account.dob
        }

        this.setState({
            form,
            isLoadingForm: false
        })
    }

    onChangeForm = (form) => {
        this.setState({ form })
    }

    onSubmit = async (form) => {
        this.setState({ isLoadingSubmit: true })
        form = await this.getFormSubmit(form);

        const response = await axios('put', urls["update-user"], form);

        await this.updateUserInformation();
    }
    getFormSubmit = async (form) => {
        let body = new FormData();

        for(let key in form){
            let value = form[key];

            if (value){
                if (key === 'picture'){
                    if (this.state.imageLoadUser){
                        const splitUri = {...this.state.imageLoadUser}.uri.split('.');

                        body.append('picture', {
                            uri : await this.getImageSnapShot(splitUri[splitUri.length - 1]),
                            name: 'image.' + splitUri[splitUri.length - 1],
                            type: 'image/' + splitUri[splitUri.length - 1]
                        })
                    }
                }
                if (key === 'dob'){
                    body.append('dob', moment(form.dob).format('YYYY-MM-DD'))
                }
                if (
                    key !== 'picture' &&
                    key !== 'dob'
                ) {
                    body.append(key, value);
                }
            }
        }

        return body
    }
    getImageSnapShot = async (fileType) => {
        return await captureRef(this.refImageUpload, {
            result: 'tmpfile',
            height: 300,
            width: 300,
            quality: 0.6,
            format: fileType,
        });
    }

    updateUserInformation = async () => {
        const response = await axios('get', urls["get-me"]).then(response => {
            return {
                status: 'success',
                data: response.data.data
            }
        }).catch(error => {
            return {
                status: 'error',
                data: error.response.data
            }
        })

        if (response.status === 'error'){
            this.setState({ isLoadingSubmit: false })

            return null
        }


        this.props.updateAccount(response.data.user);
        this.setState({ isLoadingSubmit: false });
        this.props.navigation.goBack();
    }

    onChangeUserImage = (imageLoadUser) => {
        this.setState({ imageLoadUser })
    }

    render() {
        const { account } = this.props;

        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={allTranslations(localization.profileHeaderEdit)} styleRoot={{ marginBottom: 24 }} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        !this.state.isLoadingForm && (
                            <Form
                                account={account}
                                form={this.state.form}
                                imageLoadUser={this.state.imageLoadUser}

                                onChangeForm={this.onChangeForm}
                                onSubmitForm={this.onSubmit}
                                onChangeImageUser={this.onChangeUserImage}
                            />
                        )
                    }
                </ScrollView>

                <ModalLoading
                    isOpen={this.state.isLoadingSubmit}
                />

                {
                    this.state.imageLoadUser && (
                        <Image
                            ref={this.refImageUpload}
                            collapsable={false}
                            source={{ uri: this.state.imageLoadUser.uri }}
                            style={{ height: 300, width: 300, top: -5000, left: -5000, position: 'absolute'}}
                        />
                    )
                }

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default ProfileEdit
