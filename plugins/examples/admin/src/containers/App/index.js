
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    clearStore,
    genresLoadingRequest,
    getTemplatesRequest,
    getExampleRequest,
    clearExample,
} from './actions';

import {
    getGenres,
    getGenresLoading,
    getGenresError,
    getTemplatesLoading,
    getTemplatesError,
    getTemplates,
    getExample,
    getExampleLoading,
    getExampleError,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapStateToProps = createStructuredSelector({
    genres: getGenres(),
    genresLoading: getGenresLoading(),
    genresError: getGenresError(),
    templates: getTemplates(),
    templatesLoading: getTemplatesLoading(),
    templatesError: getTemplatesError(),
    example: getExample(),
    exampleLoading: getExampleLoading(),
    exampleError: getExampleError(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        clearStore,
        getGenres: genresLoadingRequest,
        getTemplates: getTemplatesRequest,
        getExample: getExampleRequest,
        clearExample,
    },
    dispatch
);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const mainReducer = injectReducer({ key: 'templatesGeneratorReducer', reducer });
const withSaga = injectSaga({ key: 'templatesGenerator', saga });

export default compose(
    mainReducer,
    withSaga,
    withConnect
)(injectIntl(View));
