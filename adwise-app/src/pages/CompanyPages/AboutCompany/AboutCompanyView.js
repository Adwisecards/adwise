import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import {Header, Page, PagesNavigations} from "../components";
import commonStyles from "../../../theme/variables/commonStyles";
import {
    Gallery
} from './components';
import {MarkdownIt, tokensToAST, stringToTokens} from 'react-native-markdown-display';
import {MarkdownView} from 'react-native-markdown-view';
import {formatUnicode} from "../../../helper/FormatUnicodeMarkdown";
import axios from "../../../plugins/axios";

const converter = require('html-to-markdown');
const {width} = Dimensions.get('window');

class AboutCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),

            organization: this.props.company.company,

            descriptionMarkdown: '',

            legals: [],
        }

        this.color = (this.props.company.company.colors.primary) ? this.props.company.company.colors.primary : '#007BED';
    }

    componentDidMount = async () => {
        let descriptionHtml = this.state.organization.description;
        descriptionHtml = formatUnicode(descriptionHtml);
        let descriptionMarkdown = converter.convert(descriptionHtml);

        this.setState({
            descriptionMarkdown
        });

        await this.getLegals();
    }

    getLegals = async () => {
        const { organization } = this.state;
        const organizationId = organization?._id;

        const legals = await axios('get', `/v1/legal/get-organization-legal/${ organizationId }`).then((res) => {
            return res.data.data.legal
        }).catch(err => {
            return {}
        });

        let items = [];

        if ( legals?.info?.inn ) {
            items.push({
                label: "ИНН",
                value: legals?.info?.inn
            });
        }
        if ( legals?.info?.ogrn || legals?.info?.ogrnip ) {
            items.push({
                label: "ОГРН",
                value: legals?.info?.ogrn || legals?.info?.ogrnip
            });
        }
        if ( legals?.info?.organizationName ) {
            items.push({
                label: "Полное наименование",
                value: legals?.info?.organizationName
            });
        }
        if ( legals?.info?.addresses?.legal?.street ) {
            items.push({
                label: "Адрес",
                value: `${legals?.info?.addresses?.legal?.city} ${legals?.info?.addresses?.legal?.street}`
            });
        }

        this.setState({ legals: items })

    }

    _getHeaderBackgroundColor = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: ['rgba(0,0,0,0.0)', this.color],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderImageOpacity = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: [1, 0],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderBigLogoOpacity = () => {
        return this.state.scrollY.interpolate({
            inputRange: [0, 112],
            outputRange: [140, 50],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };
    _getHeaderHeight = () => {
        return this.state.scrollY.interpolate({
            inputRange: [-360, 0, 112],
            outputRange: [560, 200, 100],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    render() {
        const { legals } = this.state;
        const color = this.state.organization.colors.primary;
        const legalForm = this.state.organization?.legal?.form;
        const legalInfo = this.state.organization?.legal?.info || {};

        const headerBackgroundColor = this._getHeaderBackgroundColor();
        const headerImageOpacity = this._getHeaderImageOpacity();
        const headerBigLogoOpacity = this._getHeaderBigLogoOpacity();
        const headerHeight = this._getHeaderHeight();

        return (
            <Page style={styles.page} color={color}>
                <Header
                    scrollPosition={this.state.scrollPosition}
                    color={color}

                    organization={this.state.organization}
                    navigation={this.props.navigation}

                    headerBackgroundColor={headerBackgroundColor}
                    headerImageOpacity={headerImageOpacity}
                    headerHeight={headerHeight}
                    headerBigLogoOpacity={headerBigLogoOpacity}
                />

                <Animated.ScrollView
                    overScrollMode={'never'}
                    scrollEventThrottle={16}

                    contentContainerStyle={[commonStyles.container, {paddingTop: 112}]}
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
                    <PagesNavigations active={1} {...this.props} color={color}/>

                    <View style={[styles.section, {paddingTop: 8}]}>
                        <View>
                            <MarkdownView styles={markdownStyles}>
                                {this.state.descriptionMarkdown}
                            </MarkdownView>
                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.fastLinks}>
                            {
                                this.state.organization.tags.map((tag, idx) => (
                                    <View style={[styles.fastLink, {backgroundColor: color}]} key={'tag-' + idx}>
                                        <Text style={styles.fastLinkText}>{tag.name}</Text>
                                    </View>
                                ))
                            }
                        </View>

                        {
                            (Object.keys(legalInfo).length > 0) && (
                                <>

                                    <View style={styles.separate}/>

                                    <View style={styles.legals}>

                                        {

                                            legals.map((legal, idx) => (
                                                <View style={styles.legal}>
                                                    <Text style={styles.legalTitle}>{ legal.label }</Text>
                                                    <Text style={styles.legalMessage}>{ legal.value }</Text>
                                                </View>
                                            ))

                                        }

                                    </View>

                                </>
                            )
                        }

                    </View>

                    <Gallery pictures={this.state.organization.pictures}/>
                </Animated.ScrollView>
            </Page>
        );
    }
}


const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    section: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 24
    },

    fastLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -8,
        marginBottom: -10
    },
    fastLink: {
        marginLeft: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 10
    },
    fastLinkText: {
        fontSize: 11,
        lineHeight: 11,
        color: 'white',
        fontFamily: 'AtypText_medium'
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 12
    },

    sectionServices: {
        paddingHorizontal: 12,
        paddingVertical: 6,

        borderRadius: 10,
        backgroundColor: 'white',

        marginBottom: 24
    },
    itemService: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,

        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.05)'
    },
    itemServiceIndicator: {
        width: 10,
        height: 10,
        borderRadius: 999,
        marginRight: 12
    },
    itemServiceName: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'AtypText_medium'
    },
    itemServicePrice: {
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 'auto',
        textAlign: 'right'
    },

    typographyDescription: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'AtypText',

        marginBottom: 18
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E7E8F1',
        marginVertical: 20
    },

    legals: {
        marginBottom: -20
    },
    legal: {
        marginBottom: 20
    },
    legalTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 2
    },
    legalMessage: {
        fontFamily: 'AtypText_medium',
        fontSize: 15,
        lineHeight: 19,
        color: '#808080',
        textTransform: 'uppercase',
        marginBottom: 2
    },
})
const markdownStyles = {
    text: {
        textAlign: "left",

        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'AtypText'
    },
};

export default AboutCompany
