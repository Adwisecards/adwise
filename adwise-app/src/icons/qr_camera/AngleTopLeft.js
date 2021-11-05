import React, {PureComponent} from 'react';
import Svg, {
    Path
} from 'react-native-svg';

class AngleTopLeft extends PureComponent {
    render() {
        return (
            <Svg style={this.props.style} width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M53 23L33 23C27.4772 23 23 27.4772 23 33L23 53" stroke="#ED8E00" strokeWidth="5"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
        )
    }
}

export default AngleTopLeft
