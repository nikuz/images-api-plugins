
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    genresLoadingRequest,
    setFiles,
    uploadStart,
    uploadRequest,
    uploadDone,
    uploadClearState,
    clearStore,
} from './actions';

import {
    isLoading,
    getError,
    getFiles,
    getGenres,
    isUploadLoading,
    isUploadRequested,
    isUploadingDone,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        getGenres: genresLoadingRequest,
        setFiles,
        uploadStart,
        uploadRequest,
        uploadDone,
        uploadClearState,
        clearStore,
    },
    dispatch
);

const mapStateToProps = createStructuredSelector({
    loading: isLoading(),
    error: getError(),
    files: getFiles(),
    genres: getGenres(),
    uploadLoading: isUploadLoading(),
    uploadRequested: isUploadRequested(),
    uploadingDone: isUploadingDone(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'imagesUploaderReducer', reducer });
const withSaga = injectSaga({ key: 'imagesUploader', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(injectIntl(View));
