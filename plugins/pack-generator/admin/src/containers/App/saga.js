
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    call,
    put,
    // select,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    userLoadingSuccess,
    userLoadingError,
    imagesLoadingSuccess,
    imagesLoadingError,
    quotesLoadingSuccess,
    quotesLoadingError,
} from './actions';

import constants from './constants';

const {
    USER_LOADING_REQUEST,
    IMAGES_LOADING_REQUEST,
    QUOTES_LOADING_REQUEST,
} = constants;

export function* userGet() {
    try {
        const requestURL = '/users/me';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(userLoadingSuccess(response));
        } else {
            yield put(userLoadingError());
        }
    } catch (e) {
        yield put(userLoadingError(e));
    }
}

export function* imagesGet() {
    try {
        const requestURL = '/upload/files';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(imagesLoadingSuccess(response));
        } else {
            yield put(imagesLoadingError());
        }
    } catch (e) {
        yield put(imagesLoadingError(e));
    }
}

export function* quotesGet() {
    try {
        const requestURL = '/content-manager/explorer/quotes';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(quotesLoadingSuccess(response));
        } else {
            yield put(quotesLoadingError());
        }
    } catch (e) {
        yield put(quotesLoadingError(e));
    }
}

export default function* defaultSaga() {
    const getUser = yield fork(takeLatest, USER_LOADING_REQUEST, userGet);
    const getImages = yield fork(takeLatest, IMAGES_LOADING_REQUEST, imagesGet);
    const getQuotes = yield fork(takeLatest, QUOTES_LOADING_REQUEST, quotesGet);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getUser);
    yield cancel(getImages);
    yield cancel(getQuotes);
}
