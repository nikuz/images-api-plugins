
import { createSelector } from 'reselect';

const selectDomain = () => state => state.get('ordersManagerReducer');

const getOrders = () => (
    createSelector(selectDomain(), substate => substate.orders)
);

const getOrdersLoading = () => (
    createSelector(selectDomain(), substate => substate.ordersLoading)
);

const getOrdersError = () => (
    createSelector(selectDomain(), substate => substate.ordersError)
);

const getOrdersCount = () => (
    createSelector(selectDomain(), substate => substate.ordersCount)
);

const getOrdersCountLoading = () => (
    createSelector(selectDomain(), substate => substate.ordersCountLoading)
);

const getOrdersCountError = () => (
    createSelector(selectDomain(), substate => substate.ordersCountError)
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

const getOrdersDeleteLoading = () => (
    createSelector(selectDomain(), substate => substate.ordersDeleteLoading)
);

const getOrdersDeleteError = () => (
    createSelector(selectDomain(), substate => substate.ordersDeleteError)
);

const getOrderDeletedSuccessfully = () => (
    createSelector(selectDomain(), substate => substate.orderDeletedSuccessfully)
);

export {
    getOrders,
    getOrdersLoading,
    getOrdersError,
    getOrdersCount,
    getOrdersCountLoading,
    getOrdersCountError,
    getGenres,
    getGenresLoading,
    getGenresError,
    getOrdersDeleteLoading,
    getOrdersDeleteError,
    getOrderDeletedSuccessfully,
};
