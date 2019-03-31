
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('templatesGeneratorReducer');

const getGenres = () => (
    createSelector(selectDomain(), substate => substate.genres)
);

const getGenresLoading = () => (
    createSelector(selectDomain(), substate => substate.genresLoading)
);

const getGenresError = () => (
    createSelector(selectDomain(), substate => substate.genresError)
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

const getExample = () => (
    createSelector(selectDomain(), substate => substate.example)
);

const getExampleLoading = () => (
    createSelector(selectDomain(), substate => substate.exampleLoading)
);

const getExampleError = () => (
    createSelector(selectDomain(), substate => substate.exampleError)
);

export {
    getGenres,
    getGenresLoading,
    getGenresError,
    getTemplatesLoading,
    getTemplatesError,
    getTemplates,
    getExample,
    getExampleLoading,
    getExampleError,
};
