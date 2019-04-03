
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('templatesGeneratorReducer');

const getUser = () => (
    createSelector(selectDomain(), substate => substate.user)
);

const getUserLoading = () => (
    createSelector(selectDomain(), substate => substate.userLoading)
);

const getUserError = () => (
    createSelector(selectDomain(), substate => substate.userError)
);

const getGenres = () => (
    createSelector(selectDomain(), substate => substate.genres)
);

const getGenresLoading = () => (
    createSelector(selectDomain(), substate => substate.genresLoading)
);

const getGenresError = () => (
    createSelector(selectDomain(), substate => substate.genresError)
);

const getPreviewLoading = () => (
    createSelector(selectDomain(), substate => substate.previewLoading)
);

const getPreviewError = () => (
    createSelector(selectDomain(), substate => substate.previewError)
);

const getPreviewResult = () => (
    createSelector(selectDomain(), substate => substate.previewResult)
);

const getSaveLoading = () => (
    createSelector(selectDomain(), substate => substate.saveLoading)
);

const getSaveError = () => (
    createSelector(selectDomain(), substate => substate.saveError)
);

const getSaveResult = () => (
    createSelector(selectDomain(), substate => substate.saveResult)
);

const getUpdateLoading = () => (
    createSelector(selectDomain(), substate => substate.updateLoading)
);

const getUpdateError = () => (
    createSelector(selectDomain(), substate => substate.updateError)
);

const getTemplatesLoading = () => (
    createSelector(selectDomain(), substate => substate.templatesLoading)
);

const getTemplatesError = () => (
    createSelector(selectDomain(), substate => substate.templatesError)
);

const getTemplates = () => (
    createSelector(selectDomain(), substate => substate.templates)
);

export {
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
};
