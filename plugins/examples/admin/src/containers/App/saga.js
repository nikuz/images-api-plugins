
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    call,
    put,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    genresLoadingSuccess,
    genresLoadingError,
    getTemplatesError,
    getTemplatesSuccess,
    getExampleError,
    getExampleSuccess,
} from './actions';

import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    TEMPLATES_REQUEST,
    EXAMPLE_REQUEST,
} = constants;

export function* getGenres() {
    try {
        const requestURL = '/content-manager/explorer/genre';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(genresLoadingSuccess(response));
        } else {
            yield put(genresLoadingError());
        }
    } catch (e) {
        yield put(genresLoadingError(e));
    }
}

export function* getTemplates(action) {
    try {
        const requestURL = `/templates?genre=${action.payload}`;
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(getTemplatesSuccess(response));
        } else {
            yield put(getTemplatesError());
        }
    } catch (e) {
        yield put(getTemplatesError(e));
    }
}

export function* getExample(action) {
    try {
        let requestURL = '/example/get?';
        Object.keys(action.payload).forEach((key) => {
            requestURL += `${key}=${encodeURIComponent(action.payload[key])}&`;
        });
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(getExampleSuccess(response));
        } else {
            yield put(getExampleError());
        }
    } catch (e) {
        yield put(getExampleError(e));
    }
}


export default function* defaultSaga() {
    const getGenresRequest = yield fork(takeLatest, GENRES_LOADING_REQUEST, getGenres);
    const getTemplatesRequest = yield fork(takeLatest, TEMPLATES_REQUEST, getTemplates);
    const getExampleRequest = yield fork(takeLatest, EXAMPLE_REQUEST, getExample);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getGenresRequest);
    yield cancel(getTemplatesRequest);
    yield cancel(getExampleRequest);
}
