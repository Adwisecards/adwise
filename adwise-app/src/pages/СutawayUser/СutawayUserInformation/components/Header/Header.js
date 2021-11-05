import React, { PureComponent } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Icon
} from "native-base";
import getHeightStatusBar from "../../../../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();

class Header extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            isImageMini: false,
            isShowControls: false
        }
    }

    changeSizeImage = (isImageMini, isShowControls) => {
        this.setState({isImageMini, isShowControls})
    }

    render() {
        const { url, containerHeight, valueScrollY, user, goBack } = this.props;
        const { isImageMini, isShowControls } = this.state;

        return (
            <View style={[styles.root, isImageMini && styles.rootSmall,]}>

                <Animated.View style={[
                    styles.container,
                    isImageMini && styles.containerSmall,
                    {height: containerHeight}
                ]}
                >

                    {
                        isImageMini && (
                            <TouchableOpacity style={styles.buttonBack} onPress={goBack}>
                                <Icon name="arrow-left" type="Feather" style={{color: "#8152E4"}}/>
                            </TouchableOpacity>
                        )
                    }

                    <Animated.Image
                        style={[
                            styles.userImage,
                            isImageMini && styles.userImageSmall,
                            {borderColor: user.color}
                        ]}
                        source={{uri: url}}
                    />

                    {
                        isImageMini && (
                            <Text style={styles.userName}>{`${user?.firstName?.value}\n${user?.lastName?.value}`}</Text>
                        )
                    }

                </Animated.View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        height: 90,
        position: 'relative'
    },
    rootSmall: {
        elevation: 2,
        backgroundColor: "white"
    },

    buttonBack: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -14
    },

    userName: {
        marginLeft: 12,
        fontFamily: "AtypText_medium",
        fontSize: 20,
        lineHeight: 22,
        color: "black"
    },

    userImage: {
        height: '100%',
        width: '100%',
    },
    userImageSmall: {
        height: 50,
        width: 50,
        borderRadius: 999,

        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#8152E4",
        padding: 1
    },
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 200,
        zIndex: 20
    },
    containerSmall: {
        flexDirection: "row",
        alignItems: "center",

        paddingTop: heightStatusBar + 4,
        paddingBottom: 8,
        paddingHorizontal: 16,
    }
})

export default Header
