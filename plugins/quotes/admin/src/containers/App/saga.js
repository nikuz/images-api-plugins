
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    call,
    put,
    select,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    quotesLoadingSuccess,
    userLoadingSuccess,
    userLoadingError,
    quotesLoadingError,
    quoteUploadSuccess,
    quoteUploadError,
    genresLoadingError,
    genresLoadingSuccess,
} from './actions';
import {
    getUploadingQuote,
    getUser,
} from './selectors';
import constants from './constants';

const {
    QUOTES_LOADING_REQUEST,
    USER_LOADING_REQUEST,
    GENRES_LOADING_REQUEST,
    QUOTE_UPLOADING_REQUEST,
} = constants;

export function* getCurrentUser() {
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

export function* quotesGetExiting() {
    try {
        const requestURL = '/content-manager/explorer/quotes?_limit=2000';
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

export function* uploadQuoteItem() {
    try {
        const quote = yield select(getUploadingQuote());
        const user = yield select(getUser());
        const body = new FormData();
        body.append('author', quote.author);
        body.append('text', quote.text);
        body.append('genre', quote.genre);
        body.append('user', user._id); // eslint-disable-line
        body.append('created', new Date().toUTCString());

        const opts = {
            body,
            headers: {
                'X-Forwarded-Host': 'strapi',
            },
            method: 'POST',
        };
        const requestURL = '/content-manager/explorer/quotes';
        const response = yield call(request, requestURL, opts, false, false);

        if (response) {
            yield put(quoteUploadSuccess());
        } else {
            yield put(quoteUploadError());
        }
    } catch (e) {
        yield put(quoteUploadError(e));
    }
}

// Individual exports for testing
export function* defaultSaga() {
    const getExitingQuotes = yield fork(takeLatest, QUOTES_LOADING_REQUEST, quotesGetExiting);
    const getUserHandler = yield fork(takeLatest, USER_LOADING_REQUEST, getCurrentUser);
    const getGenresRequest = yield fork(takeLatest, GENRES_LOADING_REQUEST, getGenres);
    const uploadQuote = yield fork(takeLatest, QUOTE_UPLOADING_REQUEST, uploadQuoteItem);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getExitingQuotes);
    yield cancel(getUserHandler);
    yield cancel(getGenresRequest);
    yield cancel(uploadQuote);
}

// All sagas to be loaded
export default defaultSaga;
