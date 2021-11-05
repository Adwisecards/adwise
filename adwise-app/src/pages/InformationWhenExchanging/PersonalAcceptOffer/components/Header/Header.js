import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions, TouchableOpacity
} from 'react-native';
import {PersonalBusinessPage} from "../../../../../icons";
import {Icon} from "native-base";

const { height } = Dimensions.get('window');

const Header = (props) => {
    const {url} = props;

    if (!url){
        return (
            <View style={styles.root}>
                <PersonalBusinessPage color={'#ED8E00'}/>

                <TouchableOpacity style={styles.buttonShare} onPress={() => {props.navigation.goBack()}}>
                    <Icon type={"MaterialIcons"} name={"keyboard-backspace"} style={{fontSize: 30, color: '#8152E4'}}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <Image style={styles.image} source={{uri: url}} resizeMode={'cover'}/>

            <TouchableOpacity style={styles.buttonShare} onPress={() => {props.navigation.goBack()}}>
                <Icon type={"MaterialIcons"} name={"keyboard-backspace"} style={{fontSize: 30, color: '#8152E4'}}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        height: (( height / 3.5 )),
        marginBottom: 12
    },

    image: {
        flex: 1
    },

    buttonShare: {
        position: 'absolute',
        left: 12,
        top: 36,
        zIndex: 10,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 999,

        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Header
