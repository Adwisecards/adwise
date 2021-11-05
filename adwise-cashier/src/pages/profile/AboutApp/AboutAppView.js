import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {HistoryCard} from "./components";
import {HeaderAccounts, Page} from "../../../components";

import AutoHeightImage from 'react-native-auto-height-image';
import commonStyles from "../../../theme/variables/commonStyles";
import logoIcon from '../../../../assets/graphics/logos/logos_black.png';
import Constants from "expo-constants";
import urls from "../../../constants/urls";
import axios from "../../../plugins/axios";

class AboutApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
        }
    }

    componentDidMount = () => {
        this.getHistory();
    }

    getHistory = () => {
        axios('get', urls["versions-get-versions"]).then((response) => {
            const resVersions = response.data.data.versions;

            const history = [...resVersions, ...this.state.history];

            this.setState({ history });
        }).catch((error) => {
            console.log('error: ', error.response)
        });
    }

    routePage = (page) => {
        this.props.navigation.navigate(page);
    }

    render() {
        const { history } = this.state;

        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={'О приложении'} styleRoot={{ marginTop: 16, marginBottom: 10 }} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container, { paddingTop: 80, paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.logoContent}>
                            <AutoHeightImage
                                width={135}
                                source={logoIcon}
                            />
                        </View>
                        <Text style={styles.versionApp}>Версия { Constants?.manifest?.version }</Text>
                    </View>

                    <View style={{flex: 1}}>
                        {
                            history.map((history, idx) => (
                                <HistoryCard
                                    key={`history-${idx}`}
                                    versionApp={Constants?.manifest?.version}
                                    item={history}
                                />
                            ))
                        }
                    </View>

                </ScrollView>

            </Page>
        );
    }
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

        marginBottom: 40
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
