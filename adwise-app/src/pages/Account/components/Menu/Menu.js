import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const Menu = (props) => {
    const { list, onUserExit } = props;

    const handleGoToPath = (Path) => {
        if (!Path){
            return null
        }

        props.navigation.navigate(Path)
    }

    const onPressButton = (item) => {
        if (item.Path){
            handleGoToPath(item.Path);
        }
        if (item.isExitAccount){
            onUserExit();
        }
    }

    return (
        <View style={styles.root}>
            {
                list.map((item, idx) => {

                    return (
                        <TouchableOpacity key={`item-menu-more-${idx}`} style={styles.item} onPress={() => onPressButton(item)}>
                            <View style={styles.item_IconContainer}>
                                <Image style={styles.item_Icon} source={item.icon} resizeMode={'contain'}/>
                            </View>

                            <Text style={styles.item_Title}>{ item.title }</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    item_IconContainer: {
        width: 45,
        height: 45,
        borderRadius: 999,
        marginRight: 18,
        backgroundColor: 'white',

        justifyContent: 'center',
        alignItems: 'center'
    },
    item_Icon: {
        flex: 1,
        maxWidth: 25
    },
    item_Title: {
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20
    },
})

export default Menu
