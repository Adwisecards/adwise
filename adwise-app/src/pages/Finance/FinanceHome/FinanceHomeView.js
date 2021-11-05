import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page
} from "../../../components";
import {
    HeaderSwitch
} from "../components";
// import {
//      FinancialSection
// } from "./components";

import FinancialSection from "../FinancialSection/FinancialSectionView";
import ReferralProgram from "../ReferralProgram/ReferralProgramView";
import Carousel from 'react-native-snap-carousel';
import getHeightStatusBar from "../../../helper/getHeightStatusBar";

const heightStatusBar = getHeightStatusBar();
const { width, height } = Dimensions.get('window');

const items = [FinancialSection, ReferralProgram];

class FinanceHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 0
        }

        this._carousel = React.createRef();
    }

    componentDidMount = () => {}

    onChangeActive = (active) => {
        this._carousel?.current.snapToItem(active);
        this.setState({ active });
    }

    _renderItem = (props) => {
        const Element = props.item;

        return (
            <View style={styles.slide}>
                <Element
                    app={this.props.app}
                    props={{...this.props}}
                    navigate={this.props.navigation}
                    updateWallet={this.props.updateWallet}
                    updateAccount={this.props.updateAccount}
                />
            </View>
        );
    }

    render() {
        const { active } = this.state;

        return (
            <Page style={styles.page}>

                <HeaderSwitch active={active} onChange={this.onChangeActive}/>

                    <Carousel
                        ref={this._carousel}
                        data={items}
                        renderItem={this._renderItem}
                        sliderWidth={width}
                        itemWidth={width}

                        onSnapToItem={(active) => this.setState({ active })}
                    />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingTop: heightStatusBar + 20
    },

    slide: {
        flex: 1
    }
})

export default FinanceHome
