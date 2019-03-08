
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('imagesUploaderReducer');

const isLoading = () => (
    createSelector(selectDomain(), substate => substate.loading)
);

const getError = () => (
    createSelector(selectDomain(), substate => substate.error)
);

const getFiles = () => (
    createSelector(selectDomain(), substate => substate.files)
);

const getGenres = () => (
    createSelector(selectDomain(), substate => substate.genres)
);

const isUploadLoading = () => (
    createSelector(selectDomain(), substate => substate.uploadLoading)
);

const isUploadRequested = () => (
    createSelector(selectDomain(), substate => substate.uploadRequested)
);

const isUploadingDone = () => (
    createSelector(selectDomain(), substate => substate.uploadingDone)
);

export {
    isLoading,
    getError,
    getFiles,
    getGenres,
    isUploadLoading,
    isUploadRequested,
    isUploadingDone,
};
