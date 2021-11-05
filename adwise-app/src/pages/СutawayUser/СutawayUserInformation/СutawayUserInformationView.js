import React, {Component} from 'react';
import {
    View,
    Text,
    Share,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Animated,
} from 'react-native';
import {
    Header,
    Socials,
    Information,
    MyConnections,
    Recommendation
} from "./components";
import {
    Icon
} from 'native-base';
import {Page} from "../../../components";
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import SendShare from "../../../helper/Share";

class CutawayUserInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInformation: {},

            userId: '',

            isLoading: true
        }

        this.scrollY = new Animated.Value(0);
        this.valueScrollY = 0;

        this.refHeader = React.createRef();
    }

    componentDidMount = () => {
        this.loadUserInformation();

        this.scrollY.addListener(({ value }) => {
            this.valueScrollY = value;
            const isImageMini = value >= 126;
            const isShowControls = value >= 180;

            this.refHeader?.current?.changeSizeImage(isImageMini, isShowControls);

        })
    }

    loadUserInformation = () => {
        let userId = this.props.navigation.state.params.id;
        axios('get', urls["get-contact"] + userId).then(response => {
            this.setState({
                userInformation: response.data.data.contact,
                isLoading: false,
                userId: response.data.data.contact?.ref
            })
        })
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    shareUser = async () => {
        const { account } = this.props.app;

        let userId = this.props.navigation.state.params.id;
        const urlShare = `${ urls["web-site"] }/card/${ userId }`
        let message = `Пользователь ${ account?.firstName || '' } ${ account?.lastName || '' } рекомендует вам пользователя: ${ this.state.userInformation.lastName.value } ${ this.state.userInformation.firstName.value }\n${ urlShare }`;

        await SendShare({
            message
        })
    }

    _getHeaderSizeImage = () => {
        return this.scrollY.interpolate({
            inputRange: [-500, 0, 100, 110],
            outputRange: [1, 1, 1, 0],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderHeight = () => {
        return this.scrollY.interpolate({
            inputRange: [-360, 0, 126],
            outputRange: [560, 200, 90],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    _routeGoBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Page style={[styles.page]}></Page>
            )
        }

        const headerHeight = this._getHeaderHeight();
        const headerImageSize = this._getHeaderSizeImage();

        return (
            <Page style={[styles.page]}>

                <Header
                    ref={this.refHeader}

                    url={this.state.userInformation.picture.value}
                    valueScrollY={this.valueScrollY}
                    containerHeight={headerHeight}
                    imageSize={headerImageSize}
                    onShareUser={this.shareUser}
                    goBack={this._routeGoBack}

                    user={this.state.userInformation}
                />

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[commonStyles.container, {paddingTop: 110}]}
                    onScroll={Animated.event([
                            {
                                nativeEvent: {contentOffset: {y: this.scrollY}}
                            }
                        ])}
                >
                    <View style={{marginTop: 16}}>
                        <View style={[styles.box, styles.contact]}>
                            <View style={styles.contactLeft}>
                                <TouchableOpacity style={styles.buttonBack} onPress={this.goBack}>
                                    <Icon name={"arrow-left"} type={"Feather"}
                                          style={{fontSize: 25, color: '#8152E4'}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.contactRight}>
                                <Text style={styles.typographyName}>{ this.state.userInformation.firstName.value } { this.state.userInformation.lastName.value }</Text>
                                {(!!this.state.userInformation.activity.value) && (<Text style={styles.typographyActivity}>{ this.state.userInformation.activity.value }</Text>)}
                            </View>
                        </View>

                        <Information {...this.state.userInformation}/>

                        <Socials {...this.state.userInformation} {...this.props}/>

                        <MyConnections contacts={this.state.userInformation.contacts} {...this.props}/>

                        <Recommendation
                            subscriptions={this.state.userInformation.subscriptions}
                            userId={this.state.userId}
                            {...this.props}
                        />

                        <View style={[styles.box, styles.information]}>
                            <Text style={styles.information_Title}>Информация о себе</Text>
                            {(!!this.state.userInformation.description.value) && (<Text style={styles.information_Description}>{this.state.userInformation.description.value}</Text>)}
                        </View>
                    </View>
                </Animated.ScrollView>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    box: {
        borderRadius: 4,
        backgroundColor: 'white'
    },

    buttonBack: {
        margin: -10,
        padding: 10
    },

    contact: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 12
    },
    contactLeft: {
        marginRight: 16
    },
    contactRight: {},

    typographyName: {
        fontFamily: 'AtypText_medium',
        fontSize: 24,
        lineHeight: 26,
        marginTop: 3
    },
    typographyActivity: {
        fontSize: 18,
        lineHeight: 22,
        opacity: 0.6,
        marginTop: 6
    },

    information: {
        padding: 16
    },
    information_Title: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 23
    },
    information_Description: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        marginTop: 8
    },
})

export default CutawayUserInformation
