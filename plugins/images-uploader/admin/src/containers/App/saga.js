
import {
    takeLatest,
    call,
    put,
    fork,
} from 'redux-saga/effects';
import request from 'utils/request';

import {
    uploadSuccess,
    uploadError,
} from './actions';

import constants from './constants';

const { UPLOAD_REQUEST } = constants;

function* uploadFiles(action) {
    try {
        const headers = {
            'X-Forwarded-Host': 'strapi',
        };
        const response = yield call(
            request,
            '/images-uploader',
            { method: 'POST', headers, body: action.payload },
            false,
            false
        );

        yield put(uploadSuccess(response));
    } catch (err) {
        if (window.strapi) {
            window.strapi.notification.error('notification.error');
        }
        yield put(uploadError(err));
    }
}

export default function* defaultSaga() {
    yield fork(takeLatest, UPLOAD_REQUEST, uploadFiles);
}
