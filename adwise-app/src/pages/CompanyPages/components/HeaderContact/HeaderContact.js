import React from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StatusBar,
    StyleSheet, Platform,
} from 'react-native';
import {
    Icon
} from 'native-base';
import getHeightStatusBar from "../../../../helper/getHeightStatusBar";

const statusBarHeight = getHeightStatusBar();

const HeaderContact = (props) => {
    const {headerBackgroundColor, headerHeight, organization, organizationName, organizationShortDescription} = props;
    const coords = organization.address.coords;

    const urlImageMap = `https://maps.googleapis.com/maps/api/staticmap?center=${ coords[0] },${ coords[1] }&zoom=16&size=800x800&markers=size:800x800%7Ccolor:0x0085FF%7C${ coords[0] },${ coords[1] }&key=AIzaSyAE3aQq2N0eY_LrWgXA9gE6NjnMmaNsHrk`

    return (
        <View height={100}>
            <Animated.View style={[styles.root, {
                height: headerHeight,
                minHeight: headerHeight,
                paddingTop: statusBarHeight
            }]}>
                <Image source={{ uri: urlImageMap }} style={styles.map}/>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        position: 'relative',
        flex: 1,
        zIndex: 999,
        minHeight: 280
    },

    map: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
});

HeaderContact.defaultProps = {
    scrollPosition: 0
}

export default HeaderContact
