
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
    previewSuccess,
    previewError,
    saveError,
    saveSuccess,
    updateSuccess,
    updateError,
    getTemplatesError,
    getTemplatesSuccess,
    removeTemplateError,
    removeTemplateSuccess,
} from './actions';

import constants from './constants';

const {
    USER_LOADING_REQUEST,
    GENRES_LOADING_REQUEST,
    PREVIEW_REQUEST,
    SAVE_REQUEST,
    UPDATE_REQUEST,
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

function* getPreview(action) {
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
            yield put(previewSuccess(response));
        } else {
            yield put(previewError());
        }
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(previewError(err));
    }
}

function* save(action) {
    try {
        const headers = {
            'X-Forwarded-Host': 'strapi',
        };

        const originalFileData = new FormData();
        originalFileData.append('files', action.payload.originalFile);
        const templatePreviewData = new FormData();
        templatePreviewData.append('files', action.payload.templatePreview);

        const [originalFileResponse, templatePreviewResponse] = yield all([
            call(
                request,
                '/upload',
                { method: 'POST', headers, body: originalFileData },
                false,
                false
            ),
            call(
                request,
                '/upload',
                { method: 'POST', headers, body: templatePreviewData },
                false,
                false
            ),
        ]);

        if (
            originalFileResponse
            && originalFileResponse[0]
            && templatePreviewResponse
            && templatePreviewResponse[0]
        ) {
            const originalFile = originalFileResponse[0];
            const templatePreview = templatePreviewResponse[0];
            const templateData = new FormData();
            Object.keys(action.payload.template).forEach((item) => {
                templateData.append(item, action.payload.template[item]);
            });
            templateData.append(
                'originalImage',
                `/uploads/${originalFile.hash}${originalFile.ext}`
            );
            templateData.append('originalFileId', originalFile.id);
            templateData.append('image', `/uploads/${templatePreview.hash}${templatePreview.ext}`);
            templateData.append('fileId', templatePreview.id);
            templateData.append('system', 'true');
            const templateResponse = yield call(
                request,
                '/content-manager/explorer/templates',
                { method: 'POST', headers, body: templateData },
                false,
                false
            );

            if (templateResponse) {
                yield put(saveSuccess(templateResponse));
            } else {
                yield put(saveError('can\'t save template'));
            }
        } else {
            yield put(saveError('can\'t save file'));
        }
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(saveError(err));
    }
}

function* update(action) {
    try {
        const headers = {
            'X-Forwarded-Host': 'strapi',
        };

        const templatePreviewData = new FormData();
        templatePreviewData.append('files', action.payload.templatePreview);

        const [prevPreviewResponse, templatePreviewResponse] = yield all([
            call(
                request,
                `/upload/files/${action.payload.template.fileId}`,
                { method: 'DELETE' }
            ),
            call(
                request,
                '/upload',
                { method: 'POST', headers, body: templatePreviewData },
                false,
                false
            ),
        ]);

        if (
            prevPreviewResponse
            && templatePreviewResponse
            && templatePreviewResponse[0]
        ) {
            const templatePreview = templatePreviewResponse[0];
            const templateData = new FormData();
            Object.keys(action.payload.template).forEach((item) => {
                if (item !== 'fileId' && item !== 'image') {
                    templateData.append(item, action.payload.template[item]);
                }
            });
            templateData.append('image', `/uploads/${templatePreview.hash}${templatePreview.ext}`);
            templateData.append('fileId', templatePreview.id);
            const templateResponse = yield call(
                request,
                `/content-manager/explorer/templates/${action.payload.template.id}`,
                { method: 'PUT', headers, body: templateData },
                false,
                false
            );

            if (templateResponse) {
                yield put(updateSuccess(templateResponse));
            } else {
                yield put(updateError('can\'t save template'));
            }
        } else {
            yield put(updateError('can\'t save file'));
        }
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(updateError(err));
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
        const originalFileURL = `/upload/files/${action.payload.originalFileId}`;
        const templateURL = `/content-manager/explorer/templates/${action.payload.templateId}`;

        const [file, originalFile, template] = yield all([
            call(request, fileURL, { method: 'DELETE' }),
            call(request, originalFileURL, { method: 'DELETE' }),
            call(request, templateURL, { method: 'DELETE' }),
        ]);

        if (file && originalFile && template) {
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
    const getPreviewRequest = yield fork(takeLatest, PREVIEW_REQUEST, getPreview);
    const saveRequest = yield fork(takeLatest, SAVE_REQUEST, save);
    const updateRequest = yield fork(takeLatest, UPDATE_REQUEST, update);
    const getTemplatesRequest = yield fork(takeLatest, TEMPLATES_REQUEST, getTemplates);
    const removeTemplateRequest = yield fork(takeLatest, TEMPLATES_REMOVE_REQUEST, removeTemplate);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getUser);
    yield cancel(getGenresRequest);
    yield cancel(getPreviewRequest);
    yield cancel(saveRequest);
    yield cancel(updateRequest);
    yield cancel(getTemplatesRequest);
    yield cancel(removeTemplateRequest);
}
