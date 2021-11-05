import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import {PersonalBusinessPage} from "../../../../../icons";

const { height } = Dimensions.get('window');

const Header = (props) => {
    const {url} = props;

    if (!url){
        return (
            <View style={styles.root}>
                <PersonalBusinessPage color={'#ED8E00'}/>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <Image style={styles.image} source={{uri: url}} resizeMode={'cover'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        height: (( height / 3.5 )),
        marginBottom: 0
    },

    image: {
        flex: 1
    },
});

export default Header
