import React, { useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {

} from 'native-base';
import Palette from './Palette';

const ColorPicker = (props) => {
    const { onChangeColor, color } = props;
    const [isPaletteShow, setPaletteShow] = useState(true);

    return (
        <Palette
            onChangeColor={onChangeColor}
            color={color}
        />
    )
}

const styles = StyleSheet.create({
    root: {

    }
});

export default ColorPicker