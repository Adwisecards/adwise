import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, Platform,
} from 'react-native';
import axios from "axios";
import urls from "../../../constants/urls";
import {
    Page,
    HeaderAccounts
} from "../../../components";
import Markdown from "react-native-markdown-display";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const converter = require('html-to-markdown');

class LegalInformationPricavy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }
    }

    componentDidMount = () => {
        this.onLoadHTML();
    }

    onLoadHTML = () => {
        axios.get(`${ urls["web-site"] }/privacy.html`).then((response) => {
            let text = converter.convert(response.data);

            this.setState({
                text
            })
        })
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={allTranslations(localization.legalInformationPrivacyPolicy)} {...this.props}/>

                <ScrollView>
                    <Markdown style={markdownStyles}>
                        { this.state.text }
                    </Markdown>
                </ScrollView>

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
})

const markdownStyles = {
    // The main container
    body: {},

    // Headings
    heading1: {
        flexDirection: 'row',
        fontSize: 32,
    },
    heading2: {
        flexDirection: 'row',
        fontSize: 24,
    },
    heading3: {
        flexDirection: 'row',
        fontSize: 18,
    },
    heading4: {
        flexDirection: 'row',
        fontSize: 16,
    },
    heading5: {
        flexDirection: 'row',
        fontSize: 13,
    },
    heading6: {
        flexDirection: 'row',
        fontSize: 11,
    },

    // Horizontal Rule
    hr: {
        backgroundColor: '#000000',
        height: 1,
    },

    // Emphasis
    strong: {
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
    },
    s: {
        textDecorationLine: 'line-through',
    },

    // Blockquotes
    blockquote: {
        backgroundColor: '#F5F5F5',
        borderColor: '#CCC',
        borderLeftWidth: 4,
        marginLeft: 5,
        paddingHorizontal: 5,
    },

    // Lists
    bullet_list: {},
    ordered_list: {},
    list_item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
        marginLeft: 10,
        marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
        flex: 1,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
        marginLeft: 10,
        marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
        flex: 1,
    },

    // Code
    code_inline: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        ...Platform.select({
            ['ios']: {
                fontFamily: 'Courier',
            },
            ['android']: {
                fontFamily: 'monospace',
            },
        }),
    },
    code_block: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        ...Platform.select({
            ['ios']: {
                fontFamily: 'Courier',
            },
            ['android']: {
                fontFamily: 'monospace',
            },
        }),
    },
    fence: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        ...Platform.select({
            ['ios']: {
                fontFamily: 'Courier',
            },
            ['android']: {
                fontFamily: 'monospace',
            },
        }),
    },

    // Tables
    table: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 3,
    },
    thead: {},
    tbody: {},
    th: {
        flex: 1,
        padding: 5,
    },
    tr: {
        borderBottomWidth: 1,
        borderColor: '#000000',
        flexDirection: 'row',
    },
    td: {
        flex: 1,
        padding: 5,
    },

    // Links
    link: {
        textDecorationLine: 'underline',
    },
    blocklink: {
        flex: 1,
        borderColor: '#000000',
        borderBottomWidth: 1,
    },

    // Images
    image: {
        flex: 1,
    },

    // Text Output
    text: {},
    textgroup: {},
    paragraph: {
        fontSize: 18,

        marginBottom: 10,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
    },
    hardbreak: {
        width: '100%',
        height: 1,
    },
    softbreak: {},

    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
};

export default LegalInformationPricavy
