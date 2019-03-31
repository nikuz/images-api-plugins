
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    call,
    put,
    all,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    userLoadingSuccess,
    userLoadingError,
    genresLoadingSuccess,
    genresLoadingError,
    uploadSuccess,
    uploadError,
    saveError,
    saveSuccess,
    getTemplatesError,
    getTemplatesSuccess,
    removeTemplateError,
    removeTemplateSuccess,
} from './actions';

import constants from './constants';

const {
    USER_LOADING_REQUEST,
    GENRES_LOADING_REQUEST,
    UPLOAD_REQUEST,
    SAVE_REQUEST,
    TEMPLATES_REQUEST,
    TEMPLATES_REMOVE_REQUEST,
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
        Object.keys(action.payload).forEach((item) => {
            formData.append(item, action.payload[item]);
        });
        const response = yield call(
            request,
            '/templates-generator/preview',
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

function* save(action) {
    try {
        const headers = {
            'X-Forwarded-Host': 'strapi',
        };
        const formData = new FormData();
        Object.keys(action.payload).forEach((item) => {
            formData.append(item, action.payload[item]);
        });
        const response = yield call(
            request,
            '/templates-generator',
            { method: 'POST', headers, body: formData },
            false,
            false
        );

        if (response) {
            yield put(saveSuccess(response));
        } else {
            yield put(saveError());
        }
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(saveError(err));
    }
}

export function* getTemplates(genre) {
    try {
        const requestURL = `/templates?genre=${genre.payload}`;
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

export function* removeTemplate(action) {
    try {
        const fileURL = `/upload/files/${action.payload.fileId}`;
        const templateURL = `/content-manager/explorer/templates/${action.payload.templateId}`;

        const [file, template] = yield all([
            call(request, fileURL, { method: 'DELETE' }),
            call(request, templateURL, { method: 'DELETE' }),
        ]);

        if (file && template) {
            yield put(removeTemplateSuccess(template));
            strapi.notification.success('templates-generator.Preview.Remove-Success');
        } else {
            yield put(removeTemplateError(action.payload.templateId));
        }
    } catch (e) {
        yield put(removeTemplateError(action.payload, e));
    }
}

export default function* defaultSaga() {
    const getUser = yield fork(takeLatest, USER_LOADING_REQUEST, userGet);
    const getGenresRequest = yield fork(takeLatest, GENRES_LOADING_REQUEST, getGenres);
    const filUploadRequest = yield fork(takeLatest, UPLOAD_REQUEST, uploadFile);
    const saveRequest = yield fork(takeLatest, SAVE_REQUEST, save);
    const getTemplatesRequest = yield fork(takeLatest, TEMPLATES_REQUEST, getTemplates);
    const removeTemplateRequest = yield fork(takeLatest, TEMPLATES_REMOVE_REQUEST, removeTemplate);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getUser);
    yield cancel(getGenresRequest);
    yield cancel(filUploadRequest);
    yield cancel(saveRequest);
    yield cancel(getTemplatesRequest);
    yield cancel(removeTemplateRequest);
}
