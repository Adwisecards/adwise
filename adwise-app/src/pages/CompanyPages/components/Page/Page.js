import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import BackgroundPage from './BackgroundPage';

const Page = (props) => {
    return (
        <View style={styles.root}>
            { props.children }

            <BackgroundPage color={props.color}/>
        </View>
    )
}

const styles = StyleSheet.create({
   root: {
       flex: 1
   },
});

export default Page