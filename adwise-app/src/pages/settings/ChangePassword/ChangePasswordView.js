import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    ModalLoading,
    HeaderAccounts, DropDownHolder
} from "../../../components";
import {
    FormChangePassword
} from "./form";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenLoading: false
        }
    }

    componentDidMount = () => {}

    onChangePassword = (form, events, onClearForm) => {
        this.setState({ isOpenLoading: true });

        axios('put', `${ urls["update-user"] }`, {
            password: form.password
        }).then((response) => {
            this.setState({ isOpenLoading: false });

            DropDownHolder.alert('success', 'Успешно', 'Пароль успешно изменен');

            onClearForm();
        }).catch((error) => {


            DropDownHolder.alert('error', 'Ошибка', 'При изменении пароля произошла ошибка');
        })
    }

    render() {
        return (
            <Page style={styles.page}>

                <HeaderAccounts title={'Изменение пароля'} styleRoot={{ marginBottom: 62 }} {...this.props}/>

                <FormChangePassword
                    onChangePassword={this.onChangePassword}
                />

                <ModalLoading
                    isOpen={this.state.isOpenLoading}
                    textLoading="Идет изменения пароля"
                />

            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '',
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default ChangePassword
