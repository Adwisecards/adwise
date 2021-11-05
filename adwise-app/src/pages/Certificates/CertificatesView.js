import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, StatusBar,
} from 'react-native';
import {HeaderAccounts, Page} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import AutoHeightImage from "react-native-auto-height-image";
import {
    ModalCertificates
} from './components';

import notActiveCertificatesIcon from '../../../assets/graphics/certificates/not_active_certificates.png';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";


class Certificates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModalCertificates: false
        }
    }

    componentDidMount = () => {}

    onOpenModalCertificates = () => {
        // this.setState({ openModalCertificates: true })
    }

    render() {
        return (
            <Page style={[styles.page]}>

                <HeaderAccounts title={allTranslations(localization.certificatesTitle)} styleRoot={{marginBottom: 20}} {...this.props}/>

                <ScrollView
                    contentContainerStyle={[commonStyles.container, styles.container]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={[styles.typographyText, { marginBottom: 80 }]}>{allTranslations(localization.certificatesDescription)}</Text>

                    <View style={styles.content}>
                        <AutoHeightImage
                            width={180}
                            source={notActiveCertificatesIcon}
                            style={{ marginBottom: 20 }}
                        />
                        <Text style={[styles.typographyTextBold, { textAlign: 'center' }]}>{allTranslations(localization.certificatesEmpty)}</Text>
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={this.onOpenModalCertificates}>
                            <Text style={[styles.typographyButton]}>{allTranslations(localization.certificatesWhatAreCertificates)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.onOpenModalCertificates}>
                            <Text style={[styles.typographyButton]}>{allTranslations(localization.certificatesHowGet)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.onOpenModalCertificates}>
                            <Text style={[styles.typographyButton]}>{allTranslations(localization.certificatesHowUse)}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <ModalCertificates
                    isOpen={this.state.openModalCertificates}
                />
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false,
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        flex: 1,
        paddingHorizontal: 26,
        paddingTop: 20,
        paddingBottom: 20
    },

    content: {
        alignItems: 'center',
        flex: 1
    },

    buttons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: -12,
        marginLeft: -12
    },

    button: {
        marginBottom: 8,
        marginLeft: 8,

        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4'
    },

    typographyText: {
        fontSize: 20,
        lineHeight: 26
    },
    typographyTextBold: {
        fontFamily: 'AtypText_semibold',
        fontSize: 18,
        lineHeight: 23
    },
    typographyButton: {
        fontFamily: 'AtypText_medium',
        fontSize: 12,
        lineHeight: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#8152E4'
    },
})

export default Certificates
