import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('quotesLoaderReducer');

const isQuotesLoading = () => (
    createSelector(selectDomain(), substate => substate.quotesLoading)
);

const isQuotesError = () => (
    createSelector(selectDomain(), substate => substate.quotesError)
);

const getExitingQuotes = () => (
    createSelector(selectDomain(), substate => substate.quotesExiting)
);

const getUser = () => (
    createSelector(selectDomain(), substate => substate.user)
);

const isUserError = () => (
    createSelector(selectDomain(), substate => substate.userLoadError)
);

const isUserLoading = () => (
    createSelector(selectDomain(), substate => substate.userLoading)
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

const getNewQuotes = () => (
    createSelector(selectDomain(), substate => substate.quotesNew)
);

const getDuplicateQuotes = () => (
    createSelector(selectDomain(), substate => substate.quotesDuplicates)
);

const isUploadLoading = () => (
    createSelector(selectDomain(), substate => substate.uploadLoading)
);

const isUploadRequested = () => (
    createSelector(selectDomain(), substate => substate.uploadRequested)
);

const getUploadingQuote = () => (
    createSelector(selectDomain(), substate => (
        substate.quotesNew.find(item => item.loading === true)
    ))
);

const isUploadingDone = () => (
    createSelector(selectDomain(), substate => substate.uploadingDone)
);

export {
    isQuotesLoading,
    isQuotesError,
    getExitingQuotes,
    getUser,
    isUserError,
    isUserLoading,
    getGenres,
    getGenresLoading,
    getGenresError,
    getNewQuotes,
    getDuplicateQuotes,
    isUploadLoading,
    isUploadRequested,
    getUploadingQuote,
    isUploadingDone,
};
