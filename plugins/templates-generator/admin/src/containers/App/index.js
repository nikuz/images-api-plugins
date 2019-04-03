
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    userLoadingRequest,
    clearStore,
    genresLoadingRequest,
    previewRequest,
    clearPreviewResult,
    saveRequest,
    updateRequest,
    clearSaveResult,
    getTemplatesRequest,
    removeTemplateRequest,
} from './actions';

import {
    getUser,
    getUserLoading,
    getUserError,
    getGenres,
    getGenresLoading,
    getGenresError,
    getPreviewLoading,
    getPreviewError,
    getPreviewResult,
    getSaveLoading,
    getSaveError,
    getSaveResult,
    getUpdateLoading,
    getUpdateError,
    getTemplatesLoading,
    getTemplatesError,
    getTemplates,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        userLoadingRequest,
        clearStore,
        getGenres: genresLoadingRequest,
        getPreview: previewRequest,
        clearPreviewResult,
        save: saveRequest,
        update: updateRequest,
        clearSaveResult,
        getTemplates: getTemplatesRequest,
        removeTemplate: removeTemplateRequest,
    },
    dispatch
);

const mapStateToProps = createStructuredSelector({
    user: getUser(),
    userLoading: getUserLoading(),
    userError: getUserError(),
    genres: getGenres(),
    genresLoading: getGenresLoading(),
    genresError: getGenresError(),
    previewLoading: getPreviewLoading(),
    previewError: getPreviewError(),
    previewResult: getPreviewResult(),
    saveLoading: getSaveLoading(),
    saveError: getSaveError(),
    saveResult: getSaveResult(),
    updateLoading: getUpdateLoading(),
    updateError: getUpdateError(),
    templatesLoading: getTemplatesLoading(),
    templatesError: getTemplatesError(),
    templates: getTemplates(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const mainReducer = injectReducer({ key: 'templatesGeneratorReducer', reducer });
const withSaga = injectSaga({ key: 'templatesGenerator', saga });

export default compose(
    mainReducer,
    withSaga,
    withConnect
)(injectIntl(View));
