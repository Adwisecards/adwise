import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {

} from 'native-base'
import {
    Personal,
    ColorPicker
} from '../../../../components';

const { width } = Dimensions.get('window');

const widthCard = width * 0.8;

const ChoosingCardColor = (props) => {
    const { contact, response, name, onChange } = props;

    const handleChangeColor = (color) => {
        onChange({
            name,
            value: color
        })
    }

    if (Object.keys(contact).length <= 0){
        return null
    }

    delete response.ref;

    const color = contact?.color;

    return (
        <View style={styles.root}>
            <Personal
                widthCard={widthCard}
                onOpenShare={null}

                notToPage

                {...response}

                color={color || '#007BED'}
            />

            <View style={{ marginTop: 18 }}>
                <ColorPicker
                    onChangeColor={handleChangeColor}
                    color={color || '#007BED'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default ChoosingCardColor
