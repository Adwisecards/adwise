import React  from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Icon
} from 'native-base';

const LoginHeader = (props) => {
    const { isShowButtonBack, onButtonBack, title, styleRoot, styleTitle, linkGoBack, styleContainerTitle } = props;

    const handleGoBack = () => {
        const { goBack, navigate } = props.navigation;

        if (linkGoBack){
            navigate(linkGoBack)

            return null
        }

        goBack();
    }

    return (
        <View style={[styles.root, styleRoot]}>
            {
                isShowButtonBack && (
                    <View style={styles.rootLeft}>
                        <TouchableOpacity style={styles.buttonBack} onPress={() => handleGoBack()}>
                            <Icon name={'arrow-left'} style={{ color: '#8152E4' }} type={'Feather'}/>
                        </TouchableOpacity>
                    </View>
                )
            }

            <View style={[styles.rootContainerTitle, styleContainerTitle]}>
                <Text style={[styles.rootTitle, styleTitle]}>{ title }</Text>
            </View>

            {isShowButtonBack && (<View style={styles.rootRight}></View>)}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 24,
        paddingVertical: 24,

        flexDirection: 'row'
    },

    rootContainerTitle: {
        flex: 1,
        alignItems: 'center'
    },
    rootTitle: {
        fontSize: 26,
        lineHeight: 26,
        marginTop: 4,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'AtypText_medium'
    },

    rootLeft: {
        width: 45,
        height: 45,

        marginTop: -8,
        marginLeft: -8,

        justifyContent: 'center',
        alignItems: 'center'
    },
    rootRight: {
        width: 30
    },

    buttonBack: {
        margin: -16,
        padding: 16
    }
});

export default LoginHeader
