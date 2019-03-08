
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
    uploadSuccess,
    uploadError,
} from './actions';

import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    UPLOAD_REQUEST,
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

function* uploadFile(action) {
    try {
        const headers = {
            'X-Forwarded-Host': 'strapi',
        };
        const formData = new FormData();
        formData.append('file', action.payload.file);
        formData.append('size', action.payload.size);
        formData.append('genre', action.payload.genre);
        const response = yield call(
            request,
            '/images-uploader',
            { method: 'POST', headers, body: formData },
            false,
            false
        );

        if (response) {
            yield put(uploadSuccess(response));
        } else {
            yield put(uploadError());
        }
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(uploadError(err));
    }
}

export default function* defaultSaga() {
    const getGenresRequest = yield fork(takeLatest, GENRES_LOADING_REQUEST, getGenres);
    const filUploadRequest = yield fork(takeLatest, UPLOAD_REQUEST, uploadFile);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getGenresRequest);
    yield cancel(filUploadRequest);
}
