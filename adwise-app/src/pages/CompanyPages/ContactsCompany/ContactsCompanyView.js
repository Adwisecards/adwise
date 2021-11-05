import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import {
    Page,
    HeaderContact,
    PagesNavigations
} from "../components";
import {
    Icon
} from 'native-base';
import * as Linking from 'expo-linking';
import moment from 'moment';
import commonStyles from "../../../theme/variables/commonStyles";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class ContactsCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),

            organization: this.props.company.company
        }
    }

    componentDidMount = () => {}

    getWorkTimeCurrent = () => {
        let schedule = '';
        let scheduleObject = {};
        let day = '';
        let dayNumber = moment().day() - 1;
        if (dayNumber < 0) {
            dayNumber = 6
        }

        switch (dayNumber + '') {
            case '0': {
                day = 'monday';
                break
            }
                ;
            case '1': {
                day = 'thursday';
                break
            }
                ;
            case '2': {
                day = 'wednesday';
                break
            }
                ;
            case '3': {
                day = 'thursday';
                break
            }
                ;
            case '4': {
                day = 'friday';
                break
            }
                ;
            case '5': {
                day = 'saturday';
                break
            }
                ;
            case '6': {
                day = 'sunday';
                break
            }
                ;
        }

        if (!this.state.organization.schedule) {
            return allTranslations(localization.companyPagesNotFilled)
        }

        scheduleObject = this.state.organization.schedule[day];

        return allTranslations(localization.companyPagesScheduleMessage, {from: scheduleObject.from, to: scheduleObject.to})
    }

    callToOrganization = (phone) => {
        Linking.openURL(`tel:${phone}`);
    }
    sendMessageToOrganization = (email) => {
        Linking.openURL(`mailto:${email}`);
    }
    linkToSiteOrganization = (site) => {
        if (!site) {
            return null
        }

        Linking.openURL(site);
    }

    _getHeaderBackgroundColor = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: ['rgba(0,0,0,0.0)', this.state.organization.colors.primary],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderHeight = () => {
        return this.state.scrollY.interpolate({
            inputRange: [-270, 0, 190],
            outputRange: [540, 280, 90],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _routePageMap = () => {
        this.props.navigation.push('CompanyMap');
    }

    _getSocialsElements = () => {
        let data = [];
        let socialNetworks = this.props.company.company.socialNetworks;

        if (!socialNetworks){
            return []
        }



        if (socialNetworks.fb) {
            data.push({
                title: socialNetworks.fb.replace('https://fb.com/', ''),
                iconName: 'facebook',
                path: socialNetworks.fb
            })
        }
        if (socialNetworks.insta) {
            data.push({
                title: socialNetworks.insta.replace('https://instagram.com/', ''),
                iconName: 'instagram',
                path: socialNetworks.insta
            })
        }
        if (socialNetworks.vk) {
            data.push({
                title: socialNetworks.vk.replace('https://vk.com/', ''),
                iconName: 'vk',
                path: socialNetworks.vk
            })
        }

        return data
    }

    goSocialLink = (social) => {
        Linking.openURL(social.path);
    }

    render() {
        const color = this.state.organization.colors.primary;

        const headerBackgroundColor = this._getHeaderBackgroundColor();
        const headerHeight = this._getHeaderHeight();

        const socials = this._getSocialsElements();

        return (
            <Page style={styles.page} color={color}>
                <HeaderContact
                    scrollPosition={this.state.scrollPosition}
                    color={color}

                    headerBackgroundColor={headerBackgroundColor}
                    headerHeight={headerHeight}

                    organization={this.state.organization}
                    organizationName={this.state.organization?.name || ''}
                    organizationShortDescription={this.state.organization.briefDescription}
                />

                <Animated.ScrollView
                    overScrollMode={'never'}
                    scrollEventThrottle={16}

                    contentContainerStyle={[commonStyles.container, {paddingTop: 190}]}
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
                    <PagesNavigations active={2} {...this.props} color={color}/>

                    <View style={[styles.sectionWhite, {marginBottom: 12}]}>
                        <View style={styles.containerItem}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'gps-fixed'} type={"MaterialIcons"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                <Text style={styles.typographyContacts}>{this.state.organization.address.address}</Text>
                                <Text style={styles.typographyContacts}>
                                    {this.state.organization.address.country},&nbsp;
                                    {this.state.organization.address.region},&nbsp;
                                    {this.state.organization.address.city}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.containerSeparate}/>

                        <View style={styles.containerItem}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'access-time'} type={"MaterialIcons"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                <Text style={styles.typographyContacts}>{this.getWorkTimeCurrent()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.sectionWhite, {marginBottom: 12}]}>
                        <View style={styles.containerItem}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'phone'} type={"Feather"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                {
                                    (
                                        this.state.organization.phones.map((phone, idx) => (
                                            <TouchableOpacity onPress={() => this.callToOrganization(phone)}>
                                                <Text key={'phone-number-' + idx}
                                                      style={styles.typographyContacts}>{phone}</Text>
                                                {
                                                    (this.state.organization.phones.length > idx + 1) && (
                                                        <View style={[styles.containerSeparate, {marginVertical: 10}]}/>
                                                    )
                                                }
                                            </TouchableOpacity>
                                        ))
                                    )
                                }
                            </View>
                        </View>

                        <View style={styles.containerSeparate}/>

                        <View style={styles.containerItem}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'mail'} type={"Feather"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                {
                                    (this.state.organization.emails.length <= 0) && (
                                        <View>
                                            <Text style={styles.typographyContacts}>{allTranslations(localization.companyPagesNotFilled)}</Text>
                                        </View>
                                    )
                                }
                                {
                                    (
                                        this.state.organization.emails.map((email, idx) => (
                                            <TouchableOpacity onPress={() => this.sendMessageToOrganization(email)}>
                                                <Text key={'phone-number-' + idx}
                                                      style={styles.typographyContacts}>{email}</Text>
                                                {
                                                    (this.state.organization.emails.length > idx + 1) && (
                                                        <View style={[styles.containerSeparate, {marginVertical: 10}]}/>
                                                    )
                                                }
                                            </TouchableOpacity>
                                        ))
                                    )
                                }
                            </View>
                        </View>

                        <View style={styles.containerSeparate}/>

                        <View style={styles.containerItem}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'language'} type={"MaterialIcons"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                <TouchableOpacity
                                    onPress={() => this.linkToSiteOrganization(this.state.organization.website)}>
                                    <Text
                                        style={styles.typographyContacts}>{(this.state.organization.website) ? this.state.organization.website : allTranslations(localization.commonNotFilled)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.sectionWhite, {marginBottom: 12}]}>
                        <TouchableOpacity style={styles.containerItem} onPress={this._routePageMap}>
                            <View style={styles.containerItemLeft}>
                                <Icon name={'map'} type={"Feather"} style={{color: color, fontSize: 24}}/>
                            </View>
                            <View style={styles.containerItemRight}>
                                <Text style={styles.typographyContacts}>{allTranslations(localization.companyPagesOpenMap)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {
                        socials && socials.length > 0 && (
                            <View style={styles.sectionWhite}>

                                {
                                    socials.map((social, idx) => (
                                        <>

                                            <View style={styles.containerItem}>
                                                <View style={styles.containerItemLeft}>
                                                    <Icon name={social.iconName} type={"MaterialCommunityIcons"} style={{color: color, fontSize: 24}}/>
                                                </View>
                                                <View style={styles.containerItemRight}>
                                                    <TouchableOpacity onPress={() => this.goSocialLink(social)}>
                                                        <Text key={'phone-number-' + idx} style={styles.typographyContacts}>{social.title}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {
                                                (socials.length > idx + 1) && (
                                                    <View style={styles.containerSeparate}/>
                                                )
                                            }

                                        </>
                                    ))
                                }

                            </View>
                        )
                    }

                </Animated.ScrollView>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    sectionWhite: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 10
    },

    containerItem: {
        flexDirection: 'row'
    },
    containerSeparate: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E8E8E8',

        width: '100%',
        height: 1,

        marginVertical: 14
    },
    containerItemLeft: {
        width: 25,
        marginRight: 16
    },
    containerItemRight: {
        flex: 1
    },

    typographyContacts: {
        flex: 1,
        flexShrink: 1,
        fontSize: 16,
        lineHeight: 23,
        fontFamily: 'AtypText'
    }
})

export default ContactsCompany
