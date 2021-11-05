import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import {
    MarkdownView
} from "react-native-markdown-view";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

const converter = require("html-to-markdown");

const HistoryCard = (props) => {
    const { item, versionApp } = props;

    const numberCurrentVersion = Number(item.version.replace(/[^\d]/g, ''));
    const numberCurrentVersionApp = Number(versionApp.replace(/[^\d]/g, ''));

    if (numberCurrentVersion > numberCurrentVersionApp) {
        return null
    }

    let commentHtml = item.comment.replace(/&nbsp;/g, '\n');
    commentHtml = commentHtml.replace(/&quot;/g, '"');
    const commentMarkdown = converter.convert(commentHtml);

    return (
        <View style={styles.card}>

            <Text style={styles.version}>{allTranslations(localization.aboutAppVersion)} { item.version }</Text>

            <Text style={styles.title}>{ item.title }</Text>

            <MarkdownView styles={markdownStyles}>
                { commentMarkdown }
            </MarkdownView>

        </View>
    )
};

const styles = StyleSheet.create({
   card: {
       backgroundColor: 'white',

       paddingHorizontal: 16,
       paddingVertical: 14,

       borderRadius: 10,

       elevation: 2,

       marginBottom: 16
   },

   version: {
       fontSize: 18,
       lineHeight: 20,
       fontFamily: 'AtypText_medium',

       marginBottom: 12
   },

   title: {
       fontSize: 18,
       lineHeight: 20,
       fontFamily: 'AtypText_medium',

       marginBottom: 2
   },

   comment: {
       fontSize: 16,
       lineHeight: 24,
       fontFamily: 'AtypText',
   },
});

const markdownStyles = {
    text: {
        textAlign: "left",

        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'AtypText',
    },
};

export default HistoryCard
