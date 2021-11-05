import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const DatePicker = (props) => {
    const {value, onChange, mode, styleButton, styleText, rightContent} = props;
    const [isOpenDatePicker, setOpenDatePicker] = useState(false);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    const handleChangeDate = (event) => {
        if (Platform.OS !== 'ios'){
            setOpenDatePicker(false);
        }

        if (event.type === 'dismissed'){
            return null
        }

        const { timestamp } = event.nativeEvent;

        onChange(timestamp)
    }
    const handleGetValueButton = (timestamp) => {
        let string = '';

        if (timestamp === null && mode === 'date'){
            if (!isPlaceholder) setIsPlaceholder(true);

            return '01.01.2000'
        }
        if (timestamp === null && mode === 'time'){
            if (!isPlaceholder) setIsPlaceholder(true);

            return '00:00'
        }

        if (isPlaceholder) setIsPlaceholder(false);

        if (mode === 'date'){
            string = moment(timestamp).format('DD MMMM YYYY');
        }
        if (mode === 'time'){
            string = moment(timestamp).format('HH:mm');
        }

        return string
    }

    const handleOpenDatePicker = () => {
        setOpenDatePicker(true)
    }

    return (
        <View>
            <TouchableOpacity style={[styles.button, styleButton ]} onPress={handleOpenDatePicker}>
                <Text style={[styles.buttonText, styleText, isPlaceholder && styles.placeholder]}>{handleGetValueButton(value)}</Text>

                { rightContent }
            </TouchableOpacity>


            {
                isOpenDatePicker && (
                    <DateTimePicker
                        value={(value) ? new Date(value) : new Date()}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={handleChangeDate}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 32,
        borderRadius: 10,
        backgroundColor: 'white'
    },

    button: {
        height: 50,
        width: '100%',
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: 'white',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 20,
        color: 'black',
        fontFamily: 'AtypText'
    },

    rootHeader: {
        marginBottom: 28
    },
    rootBody: {},

    placeholder: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontFamily: 'AtypText',

        fontSize: 20
    }
});

export default DatePicker
