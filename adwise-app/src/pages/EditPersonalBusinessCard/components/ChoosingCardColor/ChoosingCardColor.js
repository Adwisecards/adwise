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
    const { contactInformation, initialForm, onChangeInitialForm } = props;

    const handleChangeColor = (color) => {
        let newInitialForm = {...initialForm};

        newInitialForm['color'] = color;

        onChangeInitialForm(newInitialForm)
    }

    if (Object.keys(contactInformation).length <= 0){
        return null
    }

    delete contactInformation.ref;

    return (
        <View style={styles.root}>
            <Personal
                widthCard={widthCard}
                onOpenShare={null}

                notToPage

                {...contactInformation}

                color={(initialForm.color) ? initialForm.color : '#007BED'}
            />

            <View style={{ marginTop: 18 }}>
                <ColorPicker
                    onChangeColor={handleChangeColor}
                    color={(initialForm.color) ? initialForm.color : '#007BED'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default ChoosingCardColor