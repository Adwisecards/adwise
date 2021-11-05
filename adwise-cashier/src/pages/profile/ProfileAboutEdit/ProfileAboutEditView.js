import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    Header,
    ModalLoading, DropDownHolder
} from "../../../components";
import {
    FormEditProfile
} from "./form";
import {
    captureRef
} from 'react-native-view-shot';
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class ProfileAboutEdit extends Component {
    constructor(props) {
        super(props);

        const contactWork = props.app.account.contacts.find((t) => t.type === 'work');

        this.state = {
            form: {
                picture: null,
                tipsMessage: contactWork.tipsMessage || ''
            },
            contactWork: contactWork,

            isOpenModalLoading: false
        };

        this.refForm = React.createRef();
        this.refImageUpload = React.createRef();
    }

    componentDidMount = () => {}

    onChangeForm = (form) => {
        this.setState({ form });
        this.refForm.current.setValues(form);
    }
    onSubmit = async (form) => {
        this.setState({ isOpenModalLoading: true });

        const contactWork = this.props.app.account.contacts.find((t) => t.type === 'work');

        const body = await this.getBody(form);

        axios('put', `${ urls["update-contact"] }/${ contactWork._id }`, body, {
            "content-type": "multipart/form-data"
        }).then((response) => {
            this.onUpdateContacts();
        }).catch((error) => {

            this.setState({ isOpenModalLoading: false });
        });
    }
    getBody = async (form) => {
        let body = new FormData();

        body.append('tipsMessage', form.tipsMessage || " ");
        if (form.picture) {
            const picture = form.picture.uri;
            const type = picture.split('.').pop();

            body.append('picture', {
                uri : await this.getImageSnapShot(type),
                name: 'image.' + type,
                type: 'image/' + type
            })
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

    onUpdateContacts = () => {
        axios('get', `${ urls["get-me"] }`).then((response) => {
            this.props.updateAccount(response.data.data.user);

            this.setState({ isOpenModalLoading: false });

            DropDownHolder.dropDown.alertWithType('success', "Системное уведомление","Визитка успешно обновлена");
        });
    }

    onChangeImage = (image) => {

    };

    render() {
        return (
            <Page styleContainer={styles.page}>

                <Header title={'Подробная информация'} styleContainer={styles.headerContainer} {...this.props}/>

                <View style={styles.container}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>

                        <FormEditProfile
                            setRef={this.refForm}

                            form={this.state.form}
                            contactWork={this.state.contactWork}

                            onSubmit={this.onSubmit}
                            onChangeForm={this.onChangeForm}
                            {...this.props}
                        />

                    </ScrollView>
                </View>

                <ModalLoading
                    isOpen={this.state.isOpenModalLoading}
                />

                <Image
                    ref={this.refImageUpload}
                    collapsable={false}
                    source={{ uri: this.state.form?.picture?.uri }}
                    style={{ height: 300, width: 300, top: -5000, left: -5000, position: 'absolute'}}
                />

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingTop: 0
    },

    container: {
        flex: 1,
        paddingHorizontal: 12,
    },

    scrollView: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    }
})

export default ProfileAboutEdit
