import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../../components";
import commonStyles from "../../../theme/variables/commonStyles";
import * as Linking from 'expo-linking';
import urls from "../../../constants/urls";
import localization from "../../../localization/localization";
import allTranslations from "../../../localization/allTranslations";
import axios from "../../../plugins/axios";
import {getMediaUrl} from "../../../common/media";


class LegalInformationHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            documents: []
        }
    }

    componentDidMount = async () => {

        await this.getDocuments();

    }

    getDocuments = async () => {

        const documents = await axios('get', `${urls["documents-get"]}/cards`).then((res) => {
            return res.data.data.documents
        }).catch(() => {
            return []
        });

        this.setState({documents})

    }

    _openDocument = async (link) => {
        await Linking.openURL(link);
    }

    render() {

        const { documents } = this.state;

        return (
            <Page style={styles.page}>
                <HeaderAccounts
                    title={allTranslations(localization.legalInformationTitle)}
                    styleRoot={{ marginBottom: 20 }}
                    {...this.props}
                />

                <ScrollView style={[commonStyles.container]}>

                    {
                        documents.map((document, idx) => (
                            <TouchableOpacity style={styles.link} onPress={() => this._openDocument(getMediaUrl(document.file))}>
                                <Text style={styles.linkTitle}>{document.name}</Text>
                            </TouchableOpacity>
                        ))
                    }

                </ScrollView>

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    link: {
        paddingHorizontal: 18,
        paddingVertical: 16,

        backgroundColor: 'white',

        borderRadius: 10,

        marginBottom: 8
    },
    linkTitle: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 25,
        color: 'black'
    },
})

export default LegalInformationHome
