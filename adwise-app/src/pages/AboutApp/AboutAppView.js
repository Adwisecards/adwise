import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    HeaderAccounts, Switch
} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import AutoHeightImage from 'react-native-auto-height-image';

import logoIcon from '../../../assets/graphics/logos/logos_black.png';
import {Icon} from "native-base";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

class AboutApp extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    routePage = (page) => {
        this.props.navigation.navigate(page);
    }

    render() {
        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={allTranslations(localization.aboutAppTitle)} styleRoot={{ marginBottom: 60 }} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container, { paddingBottom: 40, flex: 1, alignItems: 'center' }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.logoContent}>
                        <AutoHeightImage
                            width={135}
                            source={logoIcon}
                        />
                    </View>

                    <Text style={styles.versionApp}>{allTranslations(localization.aboutAppVersion)} { this.props.appVersion }</Text>
                </ScrollView>

                <View style={{ padding: 16 }}>

                    <TouchableOpacity style={styles.buttonHistory} onPress={() => this.routePage('HistoryChangeApp')}>
                        <Text style={styles.buttonHistoryTitle}>{allTranslations(localization.aboutAppButtonChangeHistory)}</Text>
                    </TouchableOpacity>

                </View>

            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    logoContent: {
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 5
    },

    versionApp: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.01,
        textAlign: 'center',
        opacity: 0.5,

        marginBottom: 50
    },

    section: {},
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    sectionText: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: 0.01
    },
    sectionTextDisabled: {
        opacity: 0.3
    },
    sectionSeparate: {
        width: '100%',
        height: 1,
        backgroundColor: '#dddcdd'
    },

    buttonHistory: {
        backgroundColor: '#8152E4',
        borderRadius: 10,

        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    buttonHistoryTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: 0.01,
        color: 'white',
        textAlign: 'center'
    },
})

export default AboutApp
