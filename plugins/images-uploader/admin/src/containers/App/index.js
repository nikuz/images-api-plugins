
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    uploadRequest,
    clearStore,
} from './actions';

import {
    isLoading,
    getFiles,
    getError,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        uploadRequest,
        clearStore,
    },
    dispatch
);

const mapStateToProps = createStructuredSelector({
    loading: isLoading(),
    files: getFiles(),
    error: getError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'imagesUploaderReducer', reducer });
const withSaga = injectSaga({ key: 'imagesUploader', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(injectIntl(View));
