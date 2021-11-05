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
    const { isShowButtonBack, onButtonBack, title, styleRoot, styleTitle, linkGoBack, styleContainerTitle, onOpenSearch } = props;

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

            <View style={styles.rootRight}>
                <TouchableOpacity style={styles.buttonOpenSearch} onPress={onOpenSearch}>
                    <Icon style={styles.buttonOpenSearchIcon} name={'search'} type={'Feather'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 30,
        marginTop: 50,

        flexDirection: 'row',
        alignItems: 'center'
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
    },

    buttonOpenSearch: {
        width: 25,
        height: 25,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonOpenSearchIcon: {
        fontSize: 20,
        color: '#8152E4'
    }
});

export default LoginHeader
