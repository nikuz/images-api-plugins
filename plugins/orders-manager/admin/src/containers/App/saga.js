
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    all,
    call,
    put,
    // select,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    ordersSuccess,
    ordersError,
    ordersCountSuccess,
    ordersCountError,
    genresRequestSuccess,
    genresRequestError,
    deleteRequestSuccess,
    deleteRequestError,
} from './actions';

import constants from './constants';

const {
    ORDERS_GET_REQUEST,
    ORDERS_GET_COUNT_REQUEST,
    GENRES_GET_REQUEST,
    ORDERS_DELETE_REQUEST,
} = constants;

export function* ordersGet(action) {
    try {
        const limit = action.payload.limit || 10;
        const start = action.payload.start || 0;
        const requestURL = `/content-manager/explorer/orders?_limit=${limit}&_start=${start}&_sort=createdAt:DESC`;
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(ordersSuccess(response));
        } else {
            yield put(ordersError());
        }
    } catch (e) {
        yield put(ordersError(e));
    }
}

export function* ordersGetCount() {
    try {
        const requestURL = '/content-manager/explorer/orders/count';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(ordersCountSuccess(response));
        } else {
            yield put(ordersCountError());
        }
    } catch (e) {
        yield put(ordersCountError(e));
    }
}

export function* genresGet() {
    try {
        const requestURL = '/content-manager/explorer/genre';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(genresRequestSuccess(response));
        } else {
            yield put(genresRequestError());
        }
    } catch (e) {
        yield put(genresRequestError(e));
    }
}

export function* ordersDelete(action) {
    const order = action.payload;
    if (order.logo && order.logoFileId) {
        try {
            const [removedLogo, removedOrder] = yield all([
                call(
                    request,
                    `/upload/files/${order.logoFileId}`,
                    { method: 'DELETE' }
                ),
                call(
                    request,
                    `/content-manager/explorer/orders/${order.id}`,
                    { method: 'DELETE' }
                ),
            ]);

            if (removedLogo && removedOrder) {
                yield put(deleteRequestSuccess(removedOrder));
            } else {
                yield put(deleteRequestError());
            }
        } catch (e) {
            yield put(deleteRequestError(e));
        }
    } else {
        try {
            const requestURL = `/content-manager/explorer/orders/${order.id}`;
            const response = yield call(request, requestURL, { method: 'DELETE' });

            if (response) {
                yield put(deleteRequestSuccess(response));
            } else {
                yield put(deleteRequestError());
            }
        } catch (e) {
            yield put(deleteRequestError(e));
        }
    }
}

export default function* defaultSaga() {
    const getOrders = yield fork(takeLatest, ORDERS_GET_REQUEST, ordersGet);
    const getOrdersCount = yield fork(takeLatest, ORDERS_GET_COUNT_REQUEST, ordersGetCount);
    const getGenres = yield fork(takeLatest, GENRES_GET_REQUEST, genresGet);
    const deleteOrder = yield fork(takeLatest, ORDERS_DELETE_REQUEST, ordersDelete);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getOrders);
    yield cancel(getOrdersCount);
    yield cancel(getGenres);
    yield cancel(deleteOrder);
}
