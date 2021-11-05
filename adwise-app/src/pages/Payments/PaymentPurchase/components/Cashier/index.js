import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Icon
} from "native-base";
import {
    PersonalSmallCard as PersonalSmallCardIcon,
    RatingStar as RatingStarIcon
} from "../../../../../icons";

const ratings = [1, 2, 3, 4, 5];

const Cashier = (props) => {
    const {cashier, onSend} = props;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSend = () => {
        onSend({
            rating,
            comment
        })
    }

    return (
        <View style={styles.root}>

            <Text style={styles.title}>Оцените обслуживание</Text>

            <View style={styles.container}>

                <TouchableOpacity style={styles.cashier}>
                    <View style={styles.cashierImage}>
                        {
                            Boolean(cashier?.picture?.value) ? (
                                <Image
                                    source={{uri: cashier?.picture?.value}}
                                    style={{flex: 1}}
                                />
                            ) : (
                                <PersonalSmallCardIcon width="100%" height="100%" color="#808080"/>
                            )
                        }
                    </View>

                    <View style={{flex: 1}}>
                        <Text style={styles.cashierTitle}>Вас обслуживал</Text>
                        <Text style={styles.cashierName}>{`${cashier?.firstName?.value} ${cashier?.lastName?.value}`}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separate}/>

                <View style={styles.rating}>

                    <Text style={styles.ratingTitle}>Оценка</Text>

                    <View style={styles.ratingItems}>
                        {
                            ratings.map((item, idx) => (
                                <TouchableOpacity onPress={() => setRating(item)}>
                                    <RatingStarIcon
                                        color={Math.floor(rating) >= item ? '#8152E4' : '#E8E8E8'}
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                </View>

                <View style={styles.separate}/>

                <View style={styles.comment}>
                    <Text style={styles.commentTitle}>Ваш отзыв</Text>

                    <TextInput
                        value={comment}
                        multiline
                        onChangeText={setComment}
                        placeholder="Введите ваш комментарий"
                        style={styles.commentInput}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.buttonSend,
                        Boolean(rating < 1 && !comment) && styles.buttonSendDisabled,
                    ]}
                    onPress={Boolean(rating < 1 && !comment) ? null : handleSend}
                >
                    <Text
                        style={[
                            styles.buttonSendText,
                            Boolean(rating < 1 && !comment) && styles.buttonSendTextDisabled,
                        ]}
                    >Оценить</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginTop: 32
    },

    title: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: '#25233E',
        textAlign: 'center',

        marginBottom: 12
    },

    container: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 12
    },

    cashier: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cashierImage: {
        width: 41,
        height: 41,
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EAEBF0',

        marginRight: 12
    },
    cashierBody: {
        flex: 1
    },
    cashierRight: {},
    cashierTitle: {
        fontFamily: 'AtypText',
        fontSize: 12,
        lineHeight: 13,
        color: '#808080',
        marginBottom: 2
    },
    cashierName: {
        fontFamily: 'AtypText_medium',
        fontSize: 15,
        lineHeight: 17,
        color: '#25233E'
    },

    rating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        color: '#808080'
    },
    ratingItems: {
        marginLeft: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    comment: {
        marginBottom: 16
    },
    commentTitle: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,
        color: '#808080',
        marginBottom: 12
    },
    commentInput: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',

        fontFamily: 'AtypText',
        fontSize: 16,
        color: '#25233E'
    },

    separate: {
        height: 1,
        backgroundColor: '#D1D1D1',
        opacity: 0.5,
        marginHorizontal: -12,
        marginVertical: 12
    },

    buttonSend: {
        height: 46,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8152E4'
    },
    buttonSendDisabled: {
        backgroundColor: 'rgba(209, 209, 209, 0.3)'
    },
    buttonSendText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 22,
        color: 'white'
    },
    buttonSendTextDisabled: {
        color: '#808080'
    }
});

export default Cashier
