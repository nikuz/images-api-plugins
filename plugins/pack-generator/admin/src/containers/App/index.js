
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    userLoadingRequest,
    imagesLoadingRequest,
    quotesLoadingRequest,
    clearStore,
} from './actions';

import {
    getUser,
    isUserLoading,
    getImages,
    isImagesLoading,
    getQuotes,
    isQuotesLoading,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapStateToProps = createStructuredSelector({
    user: getUser(),
    userLoading: isUserLoading(),
    images: getImages(),
    imagesLoading: isImagesLoading(),
    quotes: getQuotes(),
    quotesLoading: isQuotesLoading(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        userLoadingRequest,
        imagesLoadingRequest,
        quotesLoadingRequest,
        clearStore,
    },
    dispatch
);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'packGeneratorReducer', reducer });
const withSaga = injectSaga({ key: 'packGenerator', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(injectIntl(View));
