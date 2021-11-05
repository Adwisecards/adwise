import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Picker as PickerDefault,
    Icon
} from "native-base";
import Modal from "react-native-modal";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

const { width, height } = Dimensions.get('window');

const Picker = (props) => {
    const { value, items, onChange } = props;

    const [isOpenSelect, setOpenSelect] = useState(false);

    const handleChangeItem = (value) => {
        setOpenSelect(false)
        onChange(value)
    }
    const handleGetValueLabel = () => {
        if (!value) {
            return null
        }

        if (items.length <= 0) {
            return value
        }

        return items.find((t) => t.value === value).label
    }

    return (
        <View>

            <TouchableOpacity onPress={() => setOpenSelect(true)} style={[styles.select, props.style]}>

                <Text style={[styles.selectValue, !handleGetValueLabel() && styles.selectPlaceholder]}>{ handleGetValueLabel() || allTranslations(localization.commonPleaseSelect) }</Text>

                <View style={styles.selectArrow}>
                    <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22, color: '#C4C4C4' }}/>
                </View>

            </TouchableOpacity>

            <Modal
                isVisible={isOpenSelect}
                backdropColor={'rgba(0, 0, 0, 0.5)'}

                animationIn={'pulse'}
                animationOut={'pulse'}

                animationInTiming={1}
                animationOutTiming={1}

                onBackdropPress={() => setOpenSelect(false)}
                onBackButtonPress={() => setOpenSelect(false)}
            >
                <View style={styles.menuItems}>

                    {
                        items.map((item, idx) => {
                            const isLast = Boolean(items.length - 1 === idx);

                            console.log('item: ', item);

                            return (
                                <TouchableOpacity
                                    key={`select-item-${ idx }`}
                                    style={[styles.menuItem, isLast && { marginBottom: 0 }]}
                                    onPress={() => handleChangeItem(item.value)}
                                >
                                    <Text style={styles.menuItemTitle}>{ item.label }</Text>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    select: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 8,

        backgroundColor: 'white',

        paddingHorizontal: 16,
        paddingVertical: 16,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectValue: {
        fontFamily: 'AtypText',
        fontSize: 20,
        lineHeight: 20,
        letterSpacing: 0.2,

        color: 'black'
    },
    selectPlaceholder: {
        opacity: 0.4
    },
    selectArrow: {
        width: 15,
        height: 15,

        justifyContent: 'center',
        alignItems: 'center'
    },

    menuItems: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,

        paddingVertical: 24,
        paddingHorizontal: 32,

        maxHeight: height * 0.6
    },
    menuItem: {
        paddingVertical: 8,

        marginBottom: 4
    },
    menuItemTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'black'
    },
});

const styles1 = StyleSheet.create({
    root: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,

        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)'
    },
    select: {
        width: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        height: 50,
        fontFamily: 'AtypText',
    },

    headerStyle: {
        backgroundColor: '#8152E4'
    },

    placeholderStyle: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontFamily: 'AtypText',

        fontSize: 20
    }
});

export default Picker
