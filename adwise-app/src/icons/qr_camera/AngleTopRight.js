import React, {PureComponent} from 'react';
import Svg, {
    Path
} from 'react-native-svg';

class AngleTopRight extends PureComponent {
    render() {
        return (
            <Svg style={this.props.style} width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M53 53L53 33C53 27.4772 48.5228 23 43 23L23 23" stroke="#ED8E00" strokeWidth="5"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
        )
    }
}

export default AngleTopRight
