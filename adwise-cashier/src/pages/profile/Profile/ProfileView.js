import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    Page,
    Header
} from "../../../components";
import {
    Appraisal
} from './components';
import {
    PersonalSmallCard
} from "../../../icons";
import {
    Icon
} from "native-base";

import * as Linking from 'expo-linking';
import accountAboutApp from '../../../../assets/graphics/account/account_about_app.png';

const {width} = Dimensions.get('window');

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {
    }

    _routeProfileAbout = () => {
        this.props.navigation.navigate('ProfileAbout');
    }
    _linkOpenCashierPage = (webUrl) => {
        Linking.openURL(webUrl);
    }

    _pressButton = (path) => {
        this.props.navigation.push(path)
    }

    render() {
        const {account} = this.props.app;
        const {firstName, lastName, picture, contacts} = account;
        const workContact = contacts.find((t) => t.type === 'work') || {};
        const workImage = workContact?.picture?.value;

        const webUrl = `https://adwise.cards/tips/${account._id}`;

        return (
            <Page styleContainer={styles.page}>
                <Header title={'Профиль'} styleContainer={styles.headerContainer} disabledButton/>

                <View style={styles.container}>
                    <ScrollView contentContainerStyle={{paddingVertical: 24, paddingHorizontal: 12}}
                                showsVerticalScrollIndicator={false}>

                        <TouchableOpacity
                            style={styles.profile}
                            onPress={this._routeProfileAbout}
                        >

                            <View style={styles.profileLeft}>
                                <View style={[styles.profileLogoContainer, !workImage && {padding: 0}]}>
                                    {
                                        !!workImage ? (
                                            <Image
                                                style={styles.profileLogo}
                                                source={{uri: workImage}}
                                            />
                                        ) : (
                                            <PersonalSmallCard
                                                style={{margin: -2}}
                                                color="#8152E4"
                                                width={55}
                                                height={55}
                                            />
                                        )
                                    }
                                </View>
                            </View>
                            <View style={styles.profileBody}>
                                {!!firstName && (<Text style={styles.profileName}>{firstName}</Text>)}
                                {!!lastName && (<Text style={styles.profileName}>{lastName}</Text>)}
                            </View>
                            <View style={styles.profileRight}>
                                <Icon
                                    style={{fontSize: 30, color: '#8152E4'}}
                                    type="Feather"
                                    name="chevron-right"
                                />
                            </View>

                        </TouchableOpacity>

                        <View style={styles.appraisal}>
                            <Appraisal workContact={workContact}/>
                        </View>

                        <View style={[styles.separate, {marginBottom: 18}]}/>

                        <View style={styles.qrCodeContainer}>
                            <Image
                                style={styles.qrCode}
                                source={{uri: `https://api.qrserver.com/v1/create-qr-code/?data=${webUrl}&amp;size=300x300`}}
                            />
                        </View>

                        <TouchableOpacity style={styles.buttonOpenWeb}
                                          onPress={() => this._linkOpenCashierPage(webUrl)}>
                            <Text style={styles.buttonTextOpenWeb}>Открыть WEB страницу</Text>
                        </TouchableOpacity>

                        <Text style={styles.qrCodeText}>Отсканируйте qr-код чтобы оставить чаевые</Text>

                        <View style={styles.menu}>
                            <TouchableOpacity style={styles.item} onPress={() => this._pressButton('AboutApp')}>
                                <View style={styles.item_IconContainer}>
                                    <Image style={styles.item_Icon} source={accountAboutApp} resizeMode={'contain'}/>
                                </View>

                                <Text style={styles.item_Title}>О приложении</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingTop: 0
    },

    headerContainer: {},

    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12
    },

    profile: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 28
    },
    profileLeft: {
        marginRight: 16
    },
    profileBody: {
        flex: 1
    },
    profileRight: {},
    profileLogoContainer: {
        width: 55,
        height: 55,

        borderRadius: 999,
        padding: 2,

        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#8152E4',
    },
    profileLogo: {
        flex: 1,
        borderRadius: 999
    },
    profileName: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 20,
        lineHeight: 24
    },

    appraisal: {
        marginBottom: 18
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8'
    },

    qrCodeContainer: {
        width: width * 0.6,
        height: width * 0.6,

        alignSelf: 'center'
    },
    qrCode: {
        flex: 1
    },
    qrCodeText: {
        paddingHorizontal: 24,
        marginBottom: 8,

        textAlign: 'center',
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 17,
        color: '#25233E'
    },

    buttonExit: {
        paddingVertical: 16,

        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonExitIcon: {
        width: 20,
        height: 25,
        marginRight: 16
    },
    buttonExitText: {
        fontFamily: 'AtypText',
        fontSize: 13,
        lineHeight: 14,
        color: '#808080'
    },

    buttonOpenWeb: {
        marginTop: 16,
        marginBottom: 24,
    },
    buttonTextOpenWeb: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        color: '#8152E4',
        textAlign: 'center'
    },

    menu: {
        marginTop: 24
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    item_IconContainer: {
        width: 45,
        height: 45,
        borderRadius: 999,
        marginRight: 18,
        backgroundColor: 'white',

        justifyContent: 'center',
        alignItems: 'center'
    },
    item_Icon: {
        flex: 1,
        maxWidth: 25
    },
    item_Title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20
    },
})

export default Profile
