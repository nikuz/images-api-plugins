
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

const getUploadLoading = () => (
    createSelector(selectDomain(), substate => substate.uploadLoading)
);

const getUploadError = () => (
    createSelector(selectDomain(), substate => substate.uploadError)
);

const getUploadResult = () => (
    createSelector(selectDomain(), substate => substate.uploadResult)
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
    getUploadLoading,
    getUploadError,
    getUploadResult,
    getSaveLoading,
    getSaveError,
    getSaveResult,
    getTemplatesLoading,
    getTemplatesError,
    getTemplates,
};
