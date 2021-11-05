// @flow
import {compose} from 'recompose';
import {connect} from 'react-redux';

import LanguageSelectionView from './LanguageSelectionView';

import {
    updateLanguage
} from "../../../AppState";

export default compose(
    connect(
        state => ({}),
        dispatch => ({
            updateLanguage: (language) => dispatch(updateLanguage(language))
        }),
    )
)(LanguageSelectionView);
