import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity, Platform,
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../components";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import {MarkdownView} from 'react-native-markdown-view';
import {formatJodit, formatUnicode} from "../../helper/FormatUnicodeMarkdown";
import HTML from "react-native-render-html";

const converter = require('html-to-markdown');

// https://www.npmjs.com/package/react-native-render-html

const { width } = Dimensions.get('window');

class FeedbackPage extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {
    }

    render() {
        const {params} = this.props.navigation.state;

        let question = params.question;
        // question = formatJodit(question);
        // question = formatUnicode(question);
        // question = converter.convert(question);

        let answer = params.answer;
        // answer = formatJodit(answer);
        // answer = formatUnicode(answer);
        // answer = converter.convert(answer);

        return (
            <Page style={styles.page}>
                <HeaderAccounts
                    title={allTranslations(localization.feedbackTitle)}
                    styleRoot={{marginBottom: 18}}
                    {...this.props}
                />

                <ScrollView contentContainerStyle={{paddingHorizontal: 24, flexGrow: 1}}>
                    <View style={{marginBottom: 12}}>
                        <HTML
                            source={{html: question}}
                            htmlParserOptions={{
                                xmlMode: false,
                                decodeEntities: false
                            }}
                            tagsStyles={{
                                p: {marginBottom: 8}
                            }}
                            baseFontStyle={{
                                fontFamily: 'AtypDisplay',
                                fontSize: 20,
                                lineHeight: Boolean(Platform.OS === 'ios') ? 22 : 30,
                                color: '#7b7b7c'
                            }}
                        />
                    </View>

                    <View style={{flex: 1}}>
                        <HTML
                            source={{html: answer}}
                            htmlParserOptions={{
                                xmlMode: false,
                                decodeEntities: false
                            }}
                            tagsStyles={{
                                p: {marginBottom: 12}
                            }}
                            baseFontStyle={{"fontFamily": "AtypDisplay", "fontSize": 20, "lineHeight": 30}}
                            imagesMaxWidth={width - 48}
                        />
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

    question: {
        fontFamily: 'AtypDisplay',
        fontSize: 20,
        lineHeight: 22,
        opacity: 0.5
    },
    answer: {
        fontFamily: 'AtypDisplay',
        fontSize: 18,
        lineHeight: 20,

        marginTop: 16
    },
});
const markdownStylesQuestion = {
    text: {
        textAlign: 'left',
        fontFamily: 'AtypDisplay',
        fontSize: 20,
        lineHeight: 22,
        color: '#7b7b7c'
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 12,
    },
    strong: {
        fontFamily: "AtypDisplay_medium",
        fontWeight: "400"
    }
};
const markdownStylesAnswer = {
    text: {
        textAlign: 'left',
        fontFamily: 'AtypDisplay',
        fontSize: 18,
        lineHeight: 20,
        marginTop: 16
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 12,
    },
    strong: {
        fontFamily: "AtypDisplay_medium",
        fontWeight: "400"
    }
};

export default FeedbackPage
