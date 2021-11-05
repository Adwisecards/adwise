import React from "react";
import {
    View,
    Text,
    Image,
    Animated,
    ScrollView,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TouchableHighlight
} from "react-native";

import imageBackground from "../../../../../assets/graphics/login/bg.png";
import contactsUserImage from '../../../../../assets/graphics/contacts/contacts_user_image.png';
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";

const { width, height } = Dimensions.get('window');
const heightStatusBar = getHeightStatusBar();

const ListHeaderComponent = (props) => {
    const { sections, onScrollSection } = props;

    return (
        <View
            style={styles.root}
        >
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, marginLeft: -16 }}

                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}

                horizontal
            >
                {
                    sections.map((section, idx) => {
                        const key = `section-${ section.key }`

                        return (
                            <TouchableHighlight
                                underlayColor="rgba(0, 0, 0, 0)"

                                onPress={() => onScrollSection(idx)}
                            >
                                <ImageBackground style={styles.button} source={contactsUserImage}>
                                    <Text style={styles.buttonText}>{ section.title }</Text>
                                </ImageBackground>
                            </TouchableHighlight>
                        )
                    })
                }
            </ScrollView>

            <Image
                source={imageBackground}
                style={styles.image}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        height: 48,
        position: 'absolute',
        zIndex: 999,
        top: 0,
        overflow: 'hidden',
        width: '100%'
    },

    button: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#8152E4',
        borderRadius: 999,

        width: 40,
        height: 40,

        overflow: 'hidden',

        marginLeft: 16,

        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        color: 'white'
    },

    image: {
        position: 'absolute',
        width: width,
        height: height + heightStatusBar,
        zIndex: -1,


        top: -90
    },
});

export default ListHeaderComponent
