import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StatusBar,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity, Platform
} from 'react-native';
import {
    Page,
    LoginHeader,
    ModalLoading,
    HeaderControlsButtons
} from '../../components';
import {
    Socials,
    ButtonEdit,
    Information,
    MyConnections,
    Recommendation
} from './components';
import {
    PersonalBusinessPage
} from '../../icons'
import {
    Icon
} from 'native-base';
import commonStyles from "../../theme/variables/commonStyles";
import i18n from "i18n-js";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import getHeightStatusBar from "../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

class PersonalBusinessCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idCard: null,
            cutawayData: null,

            contacts: [],

            isLoading: true
        }
    }

    componentDidMount = () => {
        this.loadCutaway();
    }

    loadCutaway = () => {
        let { id } = this.props.navigation.state.params;

        let url = urls['get-contact'] + id;

        axios('get', url).then(response => {
            this.setState({
                cutawayData: response.data.data.contact,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                cutawayData: {},
                isLoading: false
            })
        })
    }

    render() {
        if (this.state.isLoading){
            return (
                <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                    <ScrollView
                        contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <HeaderControlsButtons
                            styleContainer={{ marginBottom: 24 }}
                            { ...this.props }
                        />

                        <Text>Loading</Text>

                    </ScrollView>
                </Page>
            )
        }

        return (
            <Page style={[styles.page, {paddingTop: heightStatusBar}]}>
                <ScrollView
                    contentContainerStyle={[commonStyles.container, { paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <HeaderControlsButtons
                        styleContainer={{ marginBottom: 24 }}
                        { ...this.props }
                    />

                    <LoginHeader
                        title={'Рабочая визитка'}
                        styleRoot={styles.headerRoot}
                        styleTitle={styles.headerTitle}
                        styleContainerTitle={{ alignItems: 'flex-start' }}
                        isShowButtonBack

                        { ...this.props }
                    />

                    <View style={[styles.containerImageCard, styles.borderContainer, !this.state.cutawayData.picture.value && styles.containerImageCardPug ]}>
                        {
                            (this.state.cutawayData.picture.value) ? (
                                <Image
                                    style={styles.imageCard}
                                    source={{ uri: this.state.cutawayData.picture.value }}
                                />
                            ) : (
                                <PersonalBusinessPage color={'#ED8E00'}/>
                            )
                        }
                    </View>

                    <View style={[styles.containerName, styles.borderContainer]}>
                        <Text style={[styles.typographyName, !this.state.cutawayData.activity.value && { marginBottom: 0 }]}>{ this.state.cutawayData.firstName.value } { this.state.cutawayData.lastName.value }</Text>
                        {( this.state.cutawayData.activity.value ) ? (<Text style={styles.typographyPosition}>{ this.state.cutawayData.activity.value }</Text>) : null}
                    </View>

                    <Information {...this.state.cutawayData}/>

                    <Socials {...this.state.cutawayData} {...this.props}/>

                    {/*<MyConnections*/}
                    {/*    contacts={this.state.cutawayData.contacts}*/}
                    {/*    { ...this.props }*/}
                    {/*/>*/}

                    {/*<Recommendation subscriptions={this.state.cutawayData.subscriptions} { ...this.props }/>*/}

                    <View style={[styles.borderContainer, styles.information]}>
                        <Text style={styles.information_Title}>Информация о себе</Text>
                        <Text style={styles.information_Description}>
                            { this.state.cutawayData.description.value }
                        </Text>
                    </View>

                </ScrollView>
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

    headerRoot: {
        paddingHorizontal: 0,
        marginBottom: 16,
        marginTop: 0
    },
    headerTitle: {
        fontSize: 24,
        textAlign: 'left'
    },

    borderContainer: {
        backgroundColor: 'white',
        borderRadius: 10
    },

    controlContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',

        marginBottom: 24,
        marginLeft: -12,
    },

    containerImageCard: {
        width: '100%',
        height: 220,
        overflow: 'hidden',
        marginBottom: 12
    },
    imageCard: {
        flex: 1
    },

    containerName: {
        padding: 18,
        marginBottom: 12
    },

    socialWhiteButton: {
        marginLeft: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        minHeight: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    socialWhiteButton_IconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#ED8E00',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    socialWhiteButton_Icon: {
        fontSize: 20,
        color: 'white'
    },

    sectionCards: {
        marginBottom: 24
    },
    sectionCards_Header: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 12
    },
    sectionCards_Title: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 26
    },
    sectionCards_Count: {
        color: '#8152e4',
        marginLeft: 6
    },
    sectionCards_List: {
        marginBottom: 12
    },
    sectionCards_Button: {
        width: '100%',
        height: 33,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9671e6',
        borderRadius: 8
    },
    sectionCards_ButtonText: {
        color: '#8152E4',
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 30,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    typographyName: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 26,
        marginBottom: 6
    },
    typographyPosition: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 22,
        opacity: 0.6
    },

    information: {
        padding: 16
    },
    information_Title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 23,
        marginBottom: 8
    },
    information_Description: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19
    },

    containerImageCardPug: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PersonalBusinessCard
