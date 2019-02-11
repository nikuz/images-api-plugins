
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('packGeneratorReducer');

const getUser = () => (
    createSelector(selectDomain(), substate => substate.user)
);

const isUserLoading = () => (
    createSelector(selectDomain(), substate => substate.userLoading)
);

const getImages = () => (
    createSelector(selectDomain(), substate => substate.images)
);

const isImagesLoading = () => (
    createSelector(selectDomain(), substate => substate.imagesLoading)
);

const getQuotes = () => (
    createSelector(selectDomain(), substate => substate.quotes)
);

const isQuotesLoading = () => (
    createSelector(selectDomain(), substate => substate.quotesLoading)
);

export {
    getUser,
    isUserLoading,
    getImages,
    isImagesLoading,
    getQuotes,
    isQuotesLoading,
};
