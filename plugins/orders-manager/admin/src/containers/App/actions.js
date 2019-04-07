
import constants from './constants';

const {
    ORDERS_GET_REQUEST,
    ORDERS_GET_SUCCESS,
    ORDERS_GET_FAILURE,
    ORDERS_GET_COUNT_REQUEST,
    ORDERS_GET_COUNT_SUCCESS,
    ORDERS_GET_COUNT_FAILURE,
    GENRES_GET_REQUEST,
    GENRES_GET_SUCCESS,
    GENRES_GET_FAILURE,
    ORDERS_DELETE_REQUEST,
    ORDERS_DELETE_SUCCESS,
    ORDERS_DELETE_FAILURE,
    CLEAR_STORE,
} = constants;

export const ordersRequest = (limit, start) => ({
    type: ORDERS_GET_REQUEST,
    payload: {
        limit,
        start,
    },
});

export const ordersSuccess = data => ({
    type: ORDERS_GET_SUCCESS,
    payload: data,
});

export const ordersError = error => ({
    type: ORDERS_GET_FAILURE,
    payload: error,
});

export const ordersCountRequest = () => ({
    type: ORDERS_GET_COUNT_REQUEST,
});

export const ordersCountSuccess = data => ({
    type: ORDERS_GET_COUNT_SUCCESS,
    payload: data && data.count,
});

export const ordersCountError = error => ({
    type: ORDERS_GET_COUNT_FAILURE,
    payload: error,
});

export const genresRequest = () => ({
    type: GENRES_GET_REQUEST,
});

export const genresRequestSuccess = data => ({
    type: GENRES_GET_SUCCESS,
    payload: data,
});

export const genresRequestError = error => ({
    type: GENRES_GET_FAILURE,
    payload: error,
});

export const deleteRequest = order => ({
    type: ORDERS_DELETE_REQUEST,
    payload: order,
});

export const deleteRequestSuccess = data => ({
    type: ORDERS_DELETE_SUCCESS,
    payload: data,
});

export const deleteRequestError = error => ({
    type: ORDERS_DELETE_FAILURE,
    payload: error,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
