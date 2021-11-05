import React from "react";
import {
    View,
    Image,
    StyleSheet,
} from "react-native";
import {
    UserSmall as UserSmallIcon
} from "../../../icons";
import {Marker} from "react-native-maps";
import {compose} from "recompose";
import {connect} from "react-redux";

const MarkerUser = (props) => {
    const { app, coordinate, isOutsideCluster } = props;
    const account = app.account;
    const personalContact = account.contacts.find((t) => t.type === 'personal');
    const color = personalContact?.color || '#007BED';
    const isPicture = Boolean(account.picture);

    return (
        <Marker coordinate={coordinate} isOutsideCluster={isOutsideCluster}>
            <View style={[styles.point, {backgroundColor: color}]}>
                {
                    isPicture ? (
                        <Image
                            style={{flex: 1, borderRadius: 999}}
                            source={{uri: account.picture}}
                        />
                    ) : (
                        <UserSmallIcon color={color}/>
                    )
                }
            </View>
        </Marker>
    )
};

const styles = StyleSheet.create({
    point: {
        width: 30,
        height: 30,
        borderRadius: 999,
        borderWidth: 1,
        borderStyle: "solid",
        overflow: "hidden",
        borderColor: "rgba(255, 255, 255, 0.8)"
    }
})

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({}),
    ),
)(MarkerUser);
