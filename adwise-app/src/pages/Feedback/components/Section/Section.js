import React from 'react';
import {
    View,
    Text,
    StyleSheet, TouchableOpacity
} from 'react-native';
import {Icon} from "native-base";
import {MarkdownView} from 'react-native-markdown-view';
import {formatJodit, formatUnicode} from "../../../../helper/FormatUnicodeMarkdown";
import HTML from "react-native-render-html";
const converter = require('html-to-markdown');

const Section = (props) => {
    const {title, items, isLast} = props;

    if (!items || items.length <= 0) {
        return null
    }

    const _routePageInfo = (item) => {
        props.navigation.navigate('FeedbackPage', item)
    }

    return (
        <View style={[styles.section, isLast && {marginBottom: 0}]}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <View style={styles.sectionItems}>
                {
                    items.map((item, idx) => {
                        let question = item.question;
                        // question = formatJodit(question);
                        // question = formatUnicode(question);
                        // question = converter.convert(question);

                        return (
                            <>
                                <TouchableOpacity style={styles.sectionItem} onPress={() => _routePageInfo(item)}>
                                    <View style={{flex: 1}}>
                                        <HTML
                                            source={{html: question}}
                                            htmlParserOptions={{
                                                xmlMode: true,
                                                decodeEntities: false
                                            }}
                                            tagsStyles={{
                                                p: {marginBottom: 8}
                                            }}
                                            baseFontStyle={{
                                                fontFamily: 'AtypText',
                                                fontSize: 16,
                                                lineHeight: 22,
                                                letterSpacing: 0.01,
                                                color: '#7b7b7c'
                                            }}
                                        />
                                    </View>
                                    <Icon
                                        name={'keyboard-arrow-right'}
                                        style={{color: '#804fd4'}}
                                        type={'MaterialIcons'}
                                    />
                                </TouchableOpacity>
                                {
                                    Boolean(items.length > idx + 1) && (
                                        <View style={styles.sectionSeparate}/>
                                    )
                                }
                            </>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 32
    },
    sectionTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: 0.01,
        marginBottom: 16
    },
    sectionItems: {},

    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionText: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.01,
        opacity: 0.5
    },
    sectionTextDisabled: {
        opacity: 0.3
    },
    sectionSeparate: {
        width: '100%',
        height: 1,
        marginVertical: 8,
        backgroundColor: '#dddcdd'
    },
});
const markdownStyles = {
    text: {
        textAlign: 'left',
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0.01,
        color: '#7b7b7c'
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 12,
    }
};

export default Section
