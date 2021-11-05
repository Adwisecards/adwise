import React from 'react';
import {
    Switch as SwitchDefault
} from 'native-base';

const Switch = (props) => {
    return (
        <SwitchDefault
            thumbColor={'#804fd4'}
            trackColor={{ false: '#c5b0e3', true: '#c5b0e3' }}
            {...props}
        />
    )
}



export default Switch
