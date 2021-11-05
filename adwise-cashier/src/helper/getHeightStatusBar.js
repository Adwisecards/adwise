import {
    Platform,
    StatusBar,
    StatusBarIOS
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const getHeightStatusBar = () => {
    const isIOS = Platform.OS === 'ios';

    if ( isIOS ) {
        return getStatusBarHeight()
    }

    return StatusBar.currentHeight
}

export default getHeightStatusBar