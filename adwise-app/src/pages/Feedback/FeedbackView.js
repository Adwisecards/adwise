import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {HeaderAccounts, Page} from "../../components";
import {
    Section
} from './components';
import commonStyles from "../../theme/variables/commonStyles";
import * as Linking from 'expo-linking';
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import variables from "../../constants/variables";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

class Feedback extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: [],
        }
    }

    componentDidMount = async () => {
        await this.getSections();
    }

    getSections = async () => {
        let sections = {};
        const questions = await axios('get', urls["get-questions-by-type"]).then((response) => {
            return response.data.data.questions
        }).catch((error) => {
            return []
        });

        questions.map(question => {
            if (!sections[question.category._id]){
                sections[question.category._id] = {
                    title: question.category.name,
                    items: []
                }
            }

            sections[question.category._id]['items'].push(question)
        })

        this.setState({ sections })
    }

    _routeSupport = () => {
        Linking.openURL(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }

    render() {
        const { sections } = this.state;

        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={allTranslations(localization.feedbackTitle)} styleRoot={{marginBottom: 20}} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container, { paddingTop: 30 }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        Object.keys(sections).map(( key, idx ) => (
                            <Section
                                key={'section-' + idx}
                                isLast={idx === sections.length - 1}
                                navigation={this.props.navigation}
                                {...sections[key]}
                            />
                        ))
                    }
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={this._routeSupport}>
                        <Text style={styles.supportText}>{allTranslations(localization.commonContactSupport)}</Text>
                    </TouchableOpacity>
                </View>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    footer: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12
    },

    supportText: {
        fontFamily: "AtypText",
        fontSize: 14,
        lineHeight: 17,
        textAlign: "center",
        color: "#ED8E00"
    },
})

export default Feedback
