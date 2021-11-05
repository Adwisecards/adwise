import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Image
} from 'react-native';
import * as Linking from 'expo-linking';
import i18n from 'i18n-js';
import commonStyles from "../../../theme/variables/commonStyles";

// import imageBackground from '../../../../assets/graphics/start_screen/bg.jpg';
import imageBackground from '../../../../assets/graphics/start_screen/bg_new.jpg';
// import logo from '../../../../assets/graphics/start_screen/logo.png';
import logo from '../../../../assets/graphics/start_screen/logo_new.png';
import {connectActionSheet} from "@expo/react-native-action-sheet";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class StartScreen extends Component {
    goTo = (path = '') => {
        this.props.navigation.navigate(path)
    }

    onOpenLinksMenu = () => {
        const options = [
            allTranslations(localization.startScreenButtonPrivacyPolicy),
            allTranslations(localization.startScreenButtonTermsUse),
            allTranslations(localization.startScreenButtonCancel)
        ];
        const destructiveButtonIndex = 2;
        const cancelButtonIndex = 2;

        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            buttonIndex => {
                (async () => {
                    await this.onClickItemLinksMenu(buttonIndex)
                })()
            },
        );
    }
    onClickItemLinksMenu = (indexButton) => {
        switch (indexButton) {
            case 0: {
                Linking.openURL('https://adwise.cards/privacy-policy');

                break
            }
            case 1: {
                Linking.openURL('https://adwise.cards/user-agreement');

                break
            }
        }
    }


    render() {
        return (
            <View style={styles.page}>
                <ImageBackground
                    style={styles.imageBackground}
                    source={imageBackground}
                >
                    <ScrollView
                        contentContainerStyle={[commonStyles.container, styles.container]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.logoContent}>
                            <Image style={styles.logo} source={logo} resizeMode={'contain'}/>
                        </View>

                        <TouchableOpacity style={[styles.button, styles.buttonRegistration]}
                                          onPress={() => this.goTo('RegisterHome')}>
                            <Text
                                style={styles.buttonText}>{allTranslations(localization.startScreenButtonRegistration)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonAuthorization]}
                                          onPress={() => this.goTo('Login')}>
                            <Text
                                style={styles.buttonText}>{allTranslations(localization.startScreenButtonAuthorization)}</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.sectionBottom}>
                        <Text style={styles.sectionBottomText}>

                            {allTranslations(localization.startScreenPoliticalStart)}

                            <Text
                                style={styles.sectionBottomLink}
                                onPress={this.onOpenLinksMenu}
                            >
                                {allTranslations(localization.startScreenPoliticalPrivacyPolicy)}
                            </Text>
                            <Text
                                style={styles.sectionBottomLink}
                                onPress={this.onOpenLinksMenu}
                            >
                                {allTranslations(localization.startScreenPoliticalTermsUse)}
                            </Text>

                            {allTranslations(localization.startScreenPoliticalEnd)}

                        </Text>
                    </View>

                    <Text style={styles.versionText}>{this.props.appVersion}</Text>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },

    logoContent: {
        width: 140,
        height: 140,
        marginBottom: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        flex: 1
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 12,
        maxWidth: 280
    },
    buttonRegistration: {
        marginBottom: 16,
        backgroundColor: '#ED8E00'
    },
    buttonAuthorization: {
        marginBottom: 40,
        backgroundColor: '#8152E4'
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 20,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'AtypText'
    },
    buttonWiseWin: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    buttonTextWiseWin: {
        fontSize: 16,
        lineHeight: 16,
        color: 'white',
        opacity: 0.6,
        textAlign: 'center',
        fontFamily: 'AtypText'
    },

    sectionBottom: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    sectionBottomText: {
        maxWidth: 280,
        fontSize: 13,
        lineHeight: 14,
        textAlign: 'center',
        color: '#808080'
    },
    sectionBottomLink: {
        color: '#ed8e00'
    },

    versionText: {
        position: "absolute",
        color: "#808080",
        fontFamily: "AtypText_light",
        right: 16,
        bottom: 12,
        fontSize: 10,
        lineHeight: 12
    }
})
const StartScreenPage = connectActionSheet(StartScreen);

export default StartScreenPage
