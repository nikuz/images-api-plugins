
import { LOCATION_CHANGE } from 'react-router-redux';
import {
    takeLatest,
    call,
    put,
    fork,
    take,
    cancel,
    all,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    genresLoadingSuccess,
    genresLoadingFailure,
    uploadSuccess,
    uploadError,
    getUploadedImagesSuccess,
    getUploadedImagesFailure,
    removeImageSuccess,
    removeImageFailure,
} from './actions';

import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    UPLOAD_REQUEST,
    UPLOADED_IMAGES_REQUEST,
    REMOVE_IMAGE_REQUEST,
} = constants;

export function* getGenres() {
    try {
        const requestURL = '/content-manager/explorer/genre';
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(genresLoadingSuccess(response));
        } else {
            yield put(genresLoadingFailure());
        }
    } catch (e) {
        yield put(genresLoadingFailure(e));
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

export function* getUploadedImages(action) {
    try {
        const requestURL = `/content-manager/explorer/image?genre=${action.payload}&_limit=2000`;
        const response = yield call(request, requestURL, { method: 'GET' });

        if (response) {
            yield put(getUploadedImagesSuccess(response));
        } else {
            yield put(getUploadedImagesFailure());
        }
    } catch (e) {
        yield put(getUploadedImagesFailure(e));
    }
}

export function* removeImage(action) {
    try {
        const fileURL = `/upload/files/${action.payload.fileId}`;
        const templateURL = `/content-manager/explorer/image/${action.payload.imageId}`;

        const [file, image] = yield all([
            call(request, fileURL, { method: 'DELETE' }),
            call(request, templateURL, { method: 'DELETE' }),
        ]);

        if (file && image) {
            yield put(removeImageSuccess(action.payload.imageId, image));
            strapi.notification.success('images-uploader.Preview.Remove-Success');
        } else {
            yield put(removeImageFailure(action.payload.templateId));
        }
    } catch (e) {
        yield put(removeImageFailure(action.payload.imageId, e));
    }
}

export default function* defaultSaga() {
    const getGenresRequest = yield fork(takeLatest, GENRES_LOADING_REQUEST, getGenres);
    const filUploadRequest = yield fork(takeLatest, UPLOAD_REQUEST, uploadFile);
    const getUploadedImagesRequest = yield fork(
        takeLatest,
        UPLOADED_IMAGES_REQUEST,
        getUploadedImages
    );
    const removeImageRequest = yield fork(takeLatest, REMOVE_IMAGE_REQUEST, removeImage);

    // Suspend execution until location changes
    yield take(LOCATION_CHANGE);
    yield cancel(getGenresRequest);
    yield cancel(filUploadRequest);
    yield cancel(getUploadedImagesRequest);
    yield cancel(removeImageRequest);
}
