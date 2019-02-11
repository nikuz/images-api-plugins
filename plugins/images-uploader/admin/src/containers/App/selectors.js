
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('imagesUploaderReducer');

const isLoading = () => (
    createSelector(selectDomain(), substate => substate.loading)
);

const getFiles = () => (
    createSelector(selectDomain(), substate => substate.files)
);

const getError = () => (
    createSelector(selectDomain(), substate => substate.error)
);

export {
    isLoading,
    getFiles,
    getError,
};
