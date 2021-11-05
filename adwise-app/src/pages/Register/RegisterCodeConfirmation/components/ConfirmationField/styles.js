import {StyleSheet, Platform} from 'react-native';

export const CELL_SIZE = 60;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = '#fff';
export const NOT_EMPTY_CELL_BG_COLOR = '#8152E4';
export const ACTIVE_CELL_BG_COLOR = '#eee9f5';

const styles = StyleSheet.create({
    cellContayner: {
        marginHorizontal: 8,

        // IOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        // Android
        elevation: 3,

        overflow: 'hidden',
    },
    cell: {
        height: CELL_SIZE,
        width: CELL_SIZE,
        lineHeight: CELL_SIZE - 5,
        fontSize: 30,
        textAlign: 'center',
        borderRadius: 8,
        color: '#8152E4',
        backgroundColor: 'white',
    },

    // =======================

    root: {
        alignItems: 'center',
        paddingHorizontal: 40
    }
});

export default styles;
