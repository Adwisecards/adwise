import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    RatingStar as RatingStarIcon
} from "../../../../../icons";

const initialForm = {
    rating: 0,
    comment: '',
};

const RateYourOrder = (props) => {
    const { onSend } = props;

    const [form, setForm] = useState({...initialForm});
    const isDisabled = Boolean(form.rating <= 0 && !form.comment );

    const handleOnChange = (event) => {
        const { name, value } = event;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
    }
    const handleSendReview = () => {
        onSend(form);
    }

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Оцените заказ</Text>

            <View style={styles.separate}/>

            <View style={styles.ratingsSection}>

                <Text style={[styles.formTitle, {marginRight: 40}]}>Оценка</Text>

                <View style={styles.ratingsContainer}>
                    {
                        [1, 2, 3, 4, 5].map((rating) => (
                            <TouchableOpacity style={styles.rating} onPress={() => handleOnChange({name: 'rating', value: rating})}>
                                <RatingStarIcon
                                    color={rating <= form.rating ? '#8152E4' : '#E8E8E8'}
                                />
                            </TouchableOpacity>
                        ))
                    }
                </View>

            </View>

            <View style={styles.separate}/>

            <View style={styles.sectionComment}>

                <Text style={[styles.formTitle, {marginBottom: 12}]}>Ваш отзыв</Text>

                <TextInput
                    value={form.comment}
                    style={styles.input}
                    onChangeText={(value) => handleOnChange({name: 'comment', value})}
                    placeholder="Оставьте ваше впечатление о заказе"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    contextMenuHidden={true}
                />

            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    isDisabled && styles.buttonDisabled
                ]}
                activeOpacity={isDisabled ? 1 : 0.2}
                onPress={handleSendReview}
            >
                <Text style={[
                    styles.buttonText,
                    isDisabled && styles.buttonTextDisabled
                ]}>Оценить</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 24
    },

    title: {
        marginBottom: 8,
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        textAlign: 'center',
        color: '#25233E'
    },
    formTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        color: '#808080'
    },
    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#D1D1D1',
        opacity: 0.5,
        marginVertical: 12
    },
    input: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        borderRadius: 8,

        fontFamily: 'AtypText',
        fontSize: 14,
        color: '#25233E',

        paddingVertical: 4,
        paddingHorizontal: 12
    },
    button: {
      height: 46,
      backgroundColor: '#8152E4',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: '#E2D0FF'
    },
    buttonText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },
    buttonTextDisabled: {
        color: '#8152E4',
        opacity: 0.5
    },

    // секция оставление рейтинга
    ratingsSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating: {},
    // -------------

    // секция оставления комментария
    sectionComment: {
        marginBottom: 16
    },
    // ------------
});

export default RateYourOrder
