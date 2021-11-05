import React, {PureComponent} from 'react';
import Svg, {
    Path
} from 'react-native-svg';

class AngleBottomRight extends PureComponent {
    render() {
        return (
            <Svg style={this.props.style} width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M53 23L53 43C53 48.5228 48.5228 53 43 53L23 53" stroke="#ED8E00" strokeWidth="5"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
        )
    }
}

export default AngleBottomRight
