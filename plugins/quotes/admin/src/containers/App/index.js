
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    quotesLoadingRequest,
    userLoadingRequest,
    genresLoadingRequest,
    setQuotes,
    removeQuote,
    uploadStart,
    quoteUploadRequest,
    quotesUploadDone,
    clearUploadingState,
    clearStore,
} from './actions';
import {
    isQuotesLoading,
    isQuotesError,
    isUserLoading,
    isUserError,
    getExitingQuotes,
    getGenres,
    getGenresLoading,
    getGenresError,
    getNewQuotes,
    getDuplicateQuotes,
    isUploadLoading,
    isUploadRequested,
    isUploadingDone,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        quotesLoadingRequest,
        userLoadingRequest,
        getGenres: genresLoadingRequest,
        setQuotes,
        removeQuote,
        uploadStart,
        quoteUploadRequest,
        quotesUploadDone,
        clearUploadingState,
        clearStore,
    },
    dispatch
);

const mapStateToProps = createStructuredSelector({
    quotesLoading: isQuotesLoading(),
    quotesError: isQuotesError(),
    userLoading: isUserLoading(),
    userError: isUserError(),
    genres: getGenres(),
    genresLoading: getGenresLoading(),
    genresError: getGenresError(),
    quotesExiting: getExitingQuotes(),
    quotesNew: getNewQuotes(),
    quotesDuplicates: getDuplicateQuotes(),
    uploadLoading: isUploadLoading(),
    uploadRequested: isUploadRequested(),
    uploadingDone: isUploadingDone(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'quotesLoaderReducer', reducer });
const withSaga = injectSaga({ key: 'quotesLoader', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(injectIntl(View));
