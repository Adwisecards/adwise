import React from 'react';
import {
    Platform,
    Switch
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

const CheckBoxCustom = (props) => {
    if (Platform.OS === "ios"){
        return (
                <Switch
                    trackColor={{ false: "#c5b1e8", true: "#c5b1e8" }}
                    thumbColor={props.value ? "#8152E4" : "#c5b1e8"}

                    {...props}
                />
        )
    }

    return (
        <CheckBox {...props}/>
    )
}

export default CheckBoxCustom
