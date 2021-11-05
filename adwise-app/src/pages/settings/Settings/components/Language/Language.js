import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {
    Picker
} from '../../../../../components';
import i18n from 'i18n-js';
import {getItemAsync, setItemAsync} from "../../../../../helper/SecureStore";

const language = [
    {
        label: "Русский",
        value: "ru",
    },
    {
        label: "English",
        value: "en",
    },
    {
        label: "Português",
        value: "pt",
    },
]

class Language extends React.PureComponent {
    constructor(props) {
        super(props);

        console.log('props?.language: ', props?.language);

        this.state = {
            currentLanguage: props?.language || 'ru'
        }
    }

    onChangeLanguage = async (currentLanguage) => {
        await setItemAsync('application_language', currentLanguage);
        i18n.locale = currentLanguage;
        this.setState({currentLanguage})
        this.props.updateLanguage(currentLanguage);
    }

    render() {
        const { currentLanguage } = this.state;

        return (
            <View style={styles.root}>
                <Text style={styles.title}>Язык</Text>

                <Picker value={currentLanguage} items={language} onChange={this.onChangeLanguage}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 35
    },

    title: {
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        fontFamily: 'AtypText',

        marginBottom: 8
    }
});

export default Language
