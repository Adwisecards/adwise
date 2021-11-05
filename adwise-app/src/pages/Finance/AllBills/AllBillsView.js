import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';


class AllBills extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <View style={styles.page}>

            </View>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '',
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default AllBills
