import React from "react";
import {
    View,
    TextInput,
    StyleSheet
} from "react-native";
import {
    Icon
} from "native-base";

const Filter = (props) => {
    const {filter, onChange} = props;

    const handleOnChange = ({name, value}) => {
        let newFilter = {...filter};
        newFilter[name] = value;
        onChange(newFilter);
    }

    return (
        <View style={styles.root}>

            <View style={styles.formItem}>

                <TextInput
                    value={filter.name}
                    style={styles.formItemInput}
                    placeholder="Поиск"
                    onChangeText={(value) => handleOnChange({name: 'name', value})}
                />

                <Icon
                    name="search"
                    type="Feather"
                    style={{color: '#ED8E00', fontSize: 15}}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    root: {
        paddingHorizontal: 12,
        marginBottom: 12
    },

    formItem: {
        height: 40,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 14,
    },
    formItemInput: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 14,
        lineHeight: 20
    }
});

export default Filter
