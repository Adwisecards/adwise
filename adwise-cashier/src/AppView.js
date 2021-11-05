import React, {Component} from 'react';
import {StyleProvider} from 'native-base';
import Navigator from './navigation/Navigator';
import getTheme from './theme/components';
import material from './theme/variables/material';
import {persistor} from "./redux/store";
import * as Font from 'expo-font';
import {StatusBar, View, StyleSheet} from "react-native";
import {PersistGate} from 'redux-persist/integration/react'
import {
    Splash,
    DropDownHolder
} from "./components";
import {MaterialIcons} from '@expo/vector-icons';
import {ActionSheetProvider, connectActionSheet} from '@expo/react-native-action-sheet'
import DropdownAlert from "react-native-dropdownalert";

import * as Permissions from 'expo-permissions';
import {Camera} from "expo-camera";
import {deleteItemAsync, getItemAsync, setItemAsync} from "./helper/SecureStore";
import axios from "./plugins/axios";
import urls from "./constants/urls";

class AppView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            styleStatusBar: {
                color: 'rgba(255, 255, 255, 0)',
                style: 'dark-content',
                translucent: true
            },
            notification: {},

            isLoading: true
        };

        this.refDropDown = React.createRef();
    }

    async componentDidMount() {
        this.setVersionApp();
        // await setItemAsync('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsInVzZXJJZCI6IjVmZmQ4NDU3NTBiYzQ4MDAxMmE0NDc1ZCIsImlhdCI6MTYyMTQwOTE5MCwiZXhwIjoxNjI5MTg1MTkwfQ.e81RZHUbOvD6OgrrRJOJjcxDLgnE_taa0Dohxq_mdrc');

        const jwt = await getItemAsync('jwt');

        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),

            AtypDisplay: require('../assets/fonts/Atyp_Display.ttf'),
            AtypDisplay_bold: require('../assets/fonts/Atyp_Display_Bold.ttf'),
            AtypDisplay_light: require('../assets/fonts/Atyp_Display_Light.ttf'),
            AtypDisplay_medium: require('../assets/fonts/Atyp_Display_Medium.ttf'),
            AtypDisplay_semibold: require('../assets/fonts/Atyp_Display_Semibold.ttf'),
            AtypDisplay_thin: require('../assets/fonts/Atyp_Display_Thin.ttf'),

            AtypText: require('../assets/fonts/Atyp_Text.ttf'),
            AtypText_bold: require('../assets/fonts/Atyp_Text_Bold.ttf'),
            AtypText_light: require('../assets/fonts/Atyp_Text_Light.ttf'),
            AtypText_medium: require('../assets/fonts/Atyp_Text_Medium.ttf'),
            AtypText_semibold: require('../assets/fonts/Atyp_Text_Semibold.ttf'),
            AtypText_thin: require('../assets/fonts/Atyp_Text_Thin.ttf'),

            AtypVariable: require('../assets/fonts/Atyp_Variable.ttf'),

            ...MaterialIcons.font,
        });

        await this.getAllPermissions();

        if (!jwt) {
            this.setState({isLoading: false});
        }

        if (!!jwt) {
            await this.updateAccount();
        }
    }

    setVersionApp = () => {
        this.props.setVersionApp(this.props.version)
    }
    getAllPermissions = async () => {
        await Camera.requestPermissionsAsync();
        await Permissions.askAsync(Permissions.LOCATION);
    }

    updateAccount = async () => {
        const user = await axios('get', urls["get-me"]).then((response) => {
            return response.data.data.user;
        }).catch((error) => {
            console.log('error: ', error)

            return null
        })

        if (!user){
            this.setState({isLoading: false});
        }

        const isWorkCards = Boolean(user.contacts.find(t => t.type === 'work'));
        if (!isWorkCards) {
            await deleteItemAsync('jwt');

            this.setState({isLoading: false});

            return null
        }

        this.props.updateAccount(user);

        this.setState({isLoading: false});
    }
    updateOrganization = () => {
        axios('get', urls["get-me-organization"]).then((response) => {
            this.setState({isLoading: false});
            this.props.setOrganization(response.data.data.organization);
        }).catch((error) => {
            this.setState({isLoading: false});
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1}}>
                    <Splash/>
                </View>
            )
        }

        return (
            <PersistGate
                loading={<Splash/>}
                persistor={persistor}
            >
                <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'rgba(255, 255, 255, 0)'}
                    translucent={true}
                />
                <StyleProvider style={getTheme(material)}>
                    <ActionSheetProvider>
                        <Navigator uriPrefix="/app"/>
                    </ActionSheetProvider>
                </StyleProvider>

                <DropdownAlert
                    ref={ref => DropDownHolder.setDropDown(ref)}
                    updateStatusBar={false}

                    closeInterval={5000}
                    zIndex={9999999999999}

                    titleStyle={styles.titleStyle}
                    messageStyle={styles.messageStyle}

                    infoColor={'#ED8E00'}
                    errorColor={'#C53F3D'}
                    successColor={'#61AE2C'}


                    translucent
                />
                <DropdownAlert
                    ref={this.refDropDown}
                    updateStatusBar={false}

                    closeInterval={5000}
                    zIndex={9999999999999}

                    titleStyle={styles.titleStyle}
                    messageStyle={styles.messageStyle}

                    infoColor={'#ED8E00'}
                    errorColor={'#C53F3D'}
                    successColor={'#61AE2C'}


                    translucent
                />
            </PersistGate>
        )
    }
}

const ConnectedAppView = connectActionSheet(AppView)
const styles = StyleSheet.create({
    titleStyle: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        color: 'white'
    },
    messageStyle: {
        fontFamily: 'AtypText',
        fontSize: 14,
        color: 'white'
    },
    wrapperStyle: {
        flex: 1,
        backgroundColor: 'red'
    },
    contentContainerStyle: {
        flex: 1
    },
})

export default ConnectedAppView
