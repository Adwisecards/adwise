import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    Share,
    Clipboard
} from 'react-native';
import {
    Icon
} from 'native-base';
import {Header, Page} from "../components";
import commonStyles from "../../../theme/variables/commonStyles";
import {
    DropDownHolder,
    ModalLoading
} from '../../../components';
import urls from "../../../constants/urls";
import axios from "../../../plugins/axios";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import SendShare from "../../../helper/Share";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const {width} = Dimensions.get('window');

class ShareCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),

            invitation: {},

            isCreateInvitation: true
        }

        this.organizationId = this.props.navigation.state.params.organizationId;
        this.color = this.props.navigation.state.params.color;
        this.account = props.app.account;
    }

    componentDidMount = () => {
        this.createInvitation();
    }

    createInvitation = () => {
        axios('post', urls["create-invitation"], {
            organizationId: this.organizationId
        }).then(async (response) => {

            await amplitudeLogEventWithPropertiesAsync('user-shared-organization', {
                organizationId: this.organizationId,
                invitationId: response.data.data.invitation._id
            });

            this.setState({
                invitation: response.data.data.invitation,
                isCreateInvitation: false
            })
        }).catch(error => {
        })
    }

    copyingCode = async (code) => {
        Clipboard.setString(code);

        DropDownHolder.alert(
            'success',
            allTranslations(localization.notificationTitleSystemNotification),
            allTranslations(localization.accountUserCopyCode),
            3000
        );
    }

    shareLinkCompany = async (inviteCode) => {
        const company = this.props.company.company;
        const invitation = this.state.invitation.ref.code;

        const url = `${urls["web-site"] + '/organization/' + company._id + '/' + invitation}`;
        const message = allTranslations(localization.commonUserSharedOrganization, {
            firstName: this.account?.firstName || '',
            lastName: this.account?.lastName || '',
            organizationName: company.name,
            url
        });

        await SendShare({
            message,
            url
        });
    }

    _getHeaderBackgroundColor = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: ['rgba(0,0,0,0.0)', this.color],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderImageOpacity = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderBigLogoOpacity = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [140, 50],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderHeight = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [200, 90],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    render() {
        const color = this.color;

        const headerBackgroundColor = this._getHeaderBackgroundColor();
        const headerImageOpacity = this._getHeaderImageOpacity();
        const headerBigLogoOpacity = this._getHeaderBigLogoOpacity();
        const headerHeight = this._getHeaderHeight();

        if (this.state.isCreateInvitation) {
            return (
                <Page style={styles.page} color={color}>
                    <Header
                        scrollPosition={this.state.scrollPosition}
                        color={color}
                        navigation={this.props.navigation}

                        organization={this.props.company.company}

                        headerBackgroundColor={headerBackgroundColor}
                        headerImageOpacity={headerImageOpacity}
                        headerHeight={headerHeight}
                        headerBigLogoOpacity={headerBigLogoOpacity}
                    />

                    <View style={[commonStyles.container, {paddingTop: 120}]}>
                        <Text style={{fontSize: 24}}>{allTranslations(localization.companyPagesCreateSubscription)}</Text>
                    </View>

                </Page>
            )
        }

        const invitationParams = this.state.invitation.ref;

        return (
            <Page style={styles.page} color={color}>
                <Header
                    scrollPosition={this.state.scrollPosition}
                    color={color}
                    navigation={this.props.navigation}

                    organization={this.props.company.company}

                    headerBackgroundColor={headerBackgroundColor}
                    headerImageOpacity={headerImageOpacity}
                    headerHeight={headerHeight}
                    headerBigLogoOpacity={headerBigLogoOpacity}

                    showButtonBack

                    {...this.props}
                />

                <Animated.ScrollView
                    style={{flex: 1}}

                    overScrollMode={'never'}
                    scrollEventThrottle={16}

                    contentContainerStyle={[commonStyles.container, {paddingTop: 120}]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}

                    onEndReachedThreshold={0.2}

                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: this.state.scrollY}}
                            }
                        ]
                    )}
                >
                    <View style={styles.section}>
                        <Text style={styles.typographyTitle}>{allTranslations(localization.companyPagesShareCompany)}</Text>

                        <View style={styles.containerQrCode}>
                            <Image
                                source={{uri: invitationParams.QRCode}}
                                style={{flex: 1}}
                                resizeMode={'contain'}
                            />
                        </View>

                        <View style={styles.containerFooter}>
                            <Text style={styles.typographyFooterTitle}>{allTranslations(localization.accountUserYourCode)}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.typographyCode}>{invitationParams.code}</Text>

                                <TouchableOpacity style={styles.buttonCopying}
                                                  onPress={() => this.copyingCode(invitationParams.code)}>
                                    <Icon name={'copy'} type={"Feather"} style={{fontSize: 26, color: color}}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.buttonCopying, {marginLeft: 16}]}
                                                  onPress={() => this.shareLinkCompany(invitationParams.code)}>
                                    <Icon name={'share-2'} type={"Feather"} style={{fontSize: 26, color: color}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.ScrollView>
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

    section: {
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 1,

        alignItems: 'center',

        paddingVertical: 32,
        paddingHorizontal: 16
    },

    buttonCopying: {
        width: 25,
        height: 25,

        marginLeft: 8
    },

    containerQrCode: {
        width: width * 0.5,
        height: width * 0.5,

        marginBottom: 32
    },
    containerFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    typographyTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 30,
        lineHeight: 33,
        textAlign: 'center',

        marginBottom: 40
    },
    typographyFooterTitle: {
        textAlign: 'center',
        marginBottom: 12,

        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 23
    },
    typographyCode: {
        fontFamily: 'AtypText',
        fontSize: 26,
        lineHeight: 26,
        letterSpacing: 1,

        marginBottom: -6
    },
})

export default ShareCompany
