import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page
} from "../components";
import {
    ContactsList,
    Subscribe,
    ListShares
} from "./components";


class CompanyHome extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <View>
                <ListShares {...this.props}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default CompanyHome
