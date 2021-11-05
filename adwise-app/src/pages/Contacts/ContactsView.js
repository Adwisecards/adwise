import React, {Component} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    SectionList,
    Share,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Animated
} from 'react-native';
import {
    Page
} from "../../components";
import {
    Contact,
    Search,
    HeaderAccounts,
    ListHeaderComponent
} from "./components";

import * as Linking from "expo-linking";
import * as Permissions from "expo-permissions";
import * as Contacts from "expo-contacts";
import commonStyles from "../../theme/variables/commonStyles";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import SendShare from "../../helper/Share";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

class ContactsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: [],
            contacts: [],

            permissions: {},
            search: {
                userName: '',
                isSystem: false
            },

            contactsCount: 0,

            activeContact: null,

            isAvailable: true,
            isLoading: true,
            isOpenSearch: false
        };

        this.scrollY = new Animated.Value(0);
        this.refSectionList = React.createRef();
        this.refSearch = React.createRef();
    }

    componentDidMount = async () => {
        this.props.updateKeyboardAvoidingViewEnabled(Platform.OS !== 'ios');

        await this.onCheckPermissions();
    }
    componentWillUnmount = () => {
        this.props.updateKeyboardAvoidingViewEnabled(true);
    }

    onCheckPermissions = async () => {
        const isAvailable = await Contacts.isAvailableAsync();

        if (!isAvailable) {
            this.setState({ isAvailable: false });

            return null
        }

        const requestPermissions = await Contacts.requestPermissionsAsync();

        this.setState({
            permissions: requestPermissions
        });

        if (requestPermissions.status === 'granted') {
            await this.getListContactsUser();
        }
    }

    getListContactsUser = async () => {
        const data = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers]
        });
        let contacts = [...data.data];
        contacts = contacts.filter((contact) => {
            if (!contact.phoneNumbers || contact.phoneNumbers.length <= 0) {
                return null
            }

            return contact
        });
        let contactsAll = [];

        contacts.map((contact) => {
            contact.phoneNumbers.map((item) => {
              contactsAll.push({
                  id: contact.id,
                  full_name: contact.name || contact.firstName || contact.lastName || item['number'],
                  firstName: contact.firstName || '',
                  lastName: contact.lastName || '',
                  phone: item['number'].replace(/\D+/g,""),
                  phone_number: item['number']
              })
            })
        });
        const contactsCount = contactsAll.length;
        this.setState({
            contacts: contactsAll,
            contactsCount
        }, async () => {
            this.getMyContactsActiveSystem();
        })
    }
    initSectionsList = async () => {
        const search = this.state.search;
        let contacts = [...this.state.contacts];
        let sections = {};
        let list = [];

        contacts = contacts.filter((contact) => {
            if (!!search.userName && contact.full_name.indexOf(search.userName) <= -1 ){
                return null
            }
            if (!!search.isSystem && !contact.user_system ){
                return null
            }

            return contact
        })

        contacts.map((contact) => {

            const key = contact.full_name[0];

            if ( !sections[key] ) {
                sections[key] = {
                    key: key,
                    title: key,
                    data: [],
                }
            }

            sections[key]['data'] = [...sections[key]['data'], contact];
        });

        sections = Object.fromEntries(Object.entries(sections).sort())
        list = Object.keys(sections).map((key) => sections[key]);

        this.setState({
            sections: list,
            isLoading: false
        })
    }

    getMyContactsActiveSystem = () => {
        axios('post', urls["get-contacts"], {contacts: this.state.contacts}).then(async (response) => {
            const contacts = [...this.state.contacts];
            const contactsApp = response.data.data.contacts;

            contacts.map((contact) => {
                contact.user_system = contactsApp.find(t => t.phoneContactId === contact.id) || null
            })

            this.setState({
                contacts
            }, async () => {
                await this.initSectionsList();
            })
        }).catch(async (error) => {
            await this.initSectionsList();
        })
    }

    onInviteUser = async (contact) => {
        const { account } = this.props.app;
        const personalContact = account.contacts.find((t) => t.type === 'personal');

        const message = allTranslations(localization.commonUserSharedApp, {
            firstName: account?.firstName || '',
            lastName: account?.lastName || '',
            url: `${urls["web-site"]}/ref/${personalContact.requestRef.code}`
        })

        await SendShare({ message })
    }

    onOpenUserCard = ({ user_system }) => {
        if (!user_system) {
            return null
        }

        this.props.navigation.navigate('CutawayUserInformation', {
           id: user_system._id
        });
    }
    onOpenSettingApp = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL(`app-settings:`);
        } else {
            Linking.openSettings();
        }
    }

    onScrollSection = (idx) => {
        this.refSectionList.current?.scrollToLocation({
            animated: true,
            itemIndex: 1,
            sectionIndex: idx,
            viewOffset: 60,
            viewPosition: 0
        });
    }

    onOpenSearch = () => {
        this.refSearch.current?.open();
    }
    onCloseSearch = () => {
        this.refSearch.current?.close();
    }
    onChangeSearch = (search) => {
        this.onCloseSearch();

        this.setState({
            search
        }, async () => {
            await this.initSectionsList();
        })
    }

    _getItemLayout = (event) => {}

    render() {
        const { sections, contacts, permissions, isLoading } = this.state;

        if (permissions.status === 'denied') {
            return (
                <Page style={styles.page}>

                    <HeaderAccounts
                        title={allTranslations(localization.contactsTitle)}

                        {...this.props}
                    />

                    <View style={{ padding: 24 }}>
                        <Text style={styles.textPageHelpers}>
                            {allTranslations(localization.contactsMessagePermission)}
                        </Text>


                        <TouchableOpacity style={[styles.buttonFull, { marginTop: 24 }]} onPress={this.onOpenSettingApp}>
                            <Text style={styles.buttonFullText}>{allTranslations(localization.contactsButtonOpenSetting)}</Text>
                        </TouchableOpacity>

                    </View>

                </Page>
            )
        }
        if (isLoading) {
            return (
                <Page style={styles.page}>

                    <HeaderAccounts
                        title={allTranslations(localization.contactsTitle)}

                        {...this.props}
                    />

                    <View style={{ padding: 24 }}>
                        <Text>{allTranslations(localization.commonLoadingMessage)}</Text>
                    </View>

                </Page>
            )
        }

        return (
            <Page style={styles.page}>

                <HeaderAccounts
                    title={allTranslations(localization.contactsTitle)}
                    styleRoot={{ marginBottom: 12 }}
                    onOpenSearch={this.onOpenSearch}
                    search={this.state.search}
                    {...this.props}
                />

                <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <ListHeaderComponent
                        sections={sections}

                        onScrollSection={this.onScrollSection}
                    />

                    <SafeAreaView style={{ flex: 1 }}>
                        <SectionList
                            ref={this.refSectionList}

                            sections={sections}
                            keyExtractor={(item, idx) => `section-${ item.id }-${idx}`}

                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            stickySectionHeadersEnabled={false}

                            style={{ flex: 1 }}
                            contentContainerStyle={[commonStyles.container, { paddingTop: 40 }]}

                            overScrollMode={'never'}
                            scrollEventThrottle={16}
                            onEndReachedThreshold={0.2}

                            onScrollToIndexFailed={(event) => console.log('onScrollToIndexFailed', event)}

                            renderItem={(item) => (
                                <Contact
                                    idx={item.index}

                                    {...item.item}
                                    {...this.props}

                                    activeContact={this.state.activeContact}

                                    onInviteUser={this.onInviteUser}
                                    onOpenInfo={(activeContact) => this.setState({ activeContact })}
                                    onOpenUserCard={this.onOpenUserCard}
                                />
                            )}
                            renderSectionHeader={({section: {title}}) => (
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionHeaderTitle}>{title}</Text>
                                </View>
                            )}
                        />
                    </SafeAreaView>
                </View>

                <Search
                    setRef={this.refSearch}

                    search={this.state.search}
                    onChangeSearch={this.onChangeSearch}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    navigation: {
        height: 30,
        marginLeft: -8
    },
    navigationButton: {
        paddingHorizontal: 14,
        minWidth: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(36, 36, 36, 0.5)'
    },
    navigationButtonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 16,
        color: 'white',
        textTransform: 'uppercase'
    },

    sectionHeader: {
        marginTop: 32,
        marginBottom: 6,
        paddingHorizontal: 28
    },
    sectionHeaderTitle: {
        fontSize: 22,
        lineHeight: 31,
        fontFamily: 'AtypText_medium',
        textTransform: 'uppercase'
    },

    searchParamsSection: {
        marginBottom: 16,
        marginTop: 16,

        marginLeft: 16,
        marginRight: 16,

        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16
    },
    searchParamsText: {
        fontSize: 18,
        lineHeight: 22,

        fontFamily: 'AtypText_medium'
    },
    searchParamsButtonReset: {
        width: '100%',
        marginTop: 16,

        borderRadius: 10,
        backgroundColor: '#8152E4',
        paddingVertical: 12
    },
    searchParamsButtonResetText: {
        fontSize: 16,
        lineHeight: 16,
        color: 'white',
        fontFamily: 'AtypText_medium',
        textAlign: 'center'
    },


    textPageHelpers: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22
    },

    buttonFull: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4',

        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFullText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: 'white'
    },
})

export default ContactsPage
