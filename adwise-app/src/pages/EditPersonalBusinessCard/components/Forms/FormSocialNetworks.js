import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native';
import {Icon} from "native-base";

const ButtonClear = (props) => {
    const {value} = props;

    if (!value) {
        return null
    }

    return (
        <TouchableOpacity style={styles.buttonClear} onPress={props.onPress}>
            <Icon name={'clear'} style={styles.buttonClearIcon} type={'MaterialIcons'}/>
        </TouchableOpacity>
    )
}

const FormSocialNetworks = (props) => {
    const {setRef, initialForm, onChangeInitialForm} = props;

    const handleChangeForm = (name, value) => {
        const newForm = {...initialForm};

        newForm[name] = value;

        onChangeInitialForm(newForm);
    }

    return (
        <View style={styles.section}>

            <SocialItem
                title="Vk"
                value={initialForm.vk}
                urlSocial="vk.com/"
                onChangeText={(value) => handleChangeForm('vk', value)}
            />

            <SocialItem
                title="Instagram"
                value={initialForm.insta}
                urlSocial="instagram.com/"
                onChangeText={(value) => handleChangeForm('insta', value)}
            />

            <SocialItem
                title="Facebook"
                value={initialForm.fb}
                urlSocial="fb.com/"

                isLast

                onChangeText={(value) => handleChangeForm('fb', value)}
            />

        </View>
    )
}

const SocialItem = (props) => {
    const { title, value, urlSocial, isLast, onChangeText } = props;

    return (

        <View style={[styles.socialItem, (isLast) && { marginBottom: 0 }]}>

            <Text style={styles.socialItemTitle}>{ title }</Text>

            <View style={styles.socialItemInputContainer}>

                <Text style={styles.socialItemInputUrlSocial}>{ urlSocial }</Text>

                <TextInput
                    style={styles.socialItemInputRoot}
                    placeholder="..."
                    value={value}
                    onChangeText={onChangeText}

                    autoCapitalize={"none"}
                />
            </View>

        </View>

    )
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 40
    },

    socialItem: {
        marginBottom: 24
    },
    socialItemTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        color: 'black',
        opacity: 0.6,

        marginBottom: 8
    },
    socialItemInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingVertical: 12,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 8,

        backgroundColor: 'white'
    },
    socialItemInputUrlSocial: {
        fontFamily: 'AtypText',
        fontSize: 20,
        lineHeight: 22,
        letterSpacing: 1
    },
    socialItemInputRoot: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 20,
        letterSpacing: 1,

        height: 22
    },
});

const FormSocialNetworks1 = (props) => {
    const {setRef, initialForm, onChangeInitialForm} = props;

    const handleChangeForm = (name, value) => {
        let newInitialForm = {...initialForm};

        newInitialForm[name] = value;

        onChangeInitialForm(newInitialForm)
    }

    return (
        <Formik
            innerRef={setRef}
            initialValues={initialForm}
            validationSchema={validationSchemes}
        >
            {
                props => {
                    const values = props.values;

                    return (
                        <FormView>
                            <View style={styles.root}>
                                <View style={styles.formItem}>
                                    <Text style={styles.formItemTitle}>Vk</Text>

                                    <Input
                                        name={'vk'}

                                        value={values.vk}

                                        onChangeText={(value) => handleChangeForm('vk', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.vk}
                                                                     onPress={() => handleChangeForm('vk', '')}/>)}
                                    />
                                </View>
                                <View style={styles.formItem}>
                                    <Text style={styles.formItemTitle}>Instagram</Text>

                                    <Input
                                        name={'insta'}

                                        value={values.insta}

                                        onChangeText={(value) => handleChangeForm('insta', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.insta}
                                                                     onPress={() => handleChangeForm('insta', '')}/>)}
                                    />
                                </View>
                                <View style={styles.formItem}>
                                    <Text style={styles.formItemTitle}>Facebook</Text>

                                    <Input
                                        name={'fb'}

                                        value={values.fb}

                                        onChangeText={(value) => handleChangeForm('fb', value)}

                                        styleContainer={styles.styleContainer}
                                        styleInput={styles.styleInput}
                                        rightChildren={(<ButtonClear value={values.fb}
                                                                     onPress={() => handleChangeForm('fb', '')}/>)}
                                    />
                                </View>
                            </View>
                        </FormView>
                    )
                }
            }
        </Formik>
    )
}
const styles1 = StyleSheet.create({
    root: {},

    formItem: {
        marginBottom: 24
    },

    formItemTitle: {
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.6,
        letterSpacing: 0.01
    },

    styleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingRight: 2,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    styleInput: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },

    buttonClear: {
        padding: 15,
        marginVertical: -15
    },
    buttonClearIcon: {
        fontSize: 20,
        opacity: 0.13
    }
});

export default FormSocialNetworks
