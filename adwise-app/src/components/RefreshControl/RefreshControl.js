import React from 'react';
import {
    RefreshControl as RefreshControlDefault
} from 'react-native';

const RefreshControl = (props) => {
    return (
        <RefreshControlDefault
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}

            tintColor="#8152E4"
            titleColor="#8152E4"
            colors={["#8152E4", "#8152E4", "#8152E4"]}

            {...props}
        />
    )
}

export default RefreshControl