
import constants from './constants';

const {
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    CLEAR_STORE,
} = constants;

export const uploadRequest = files => ({
    type: UPLOAD_REQUEST,
    payload: files,
});

export const uploadSuccess = files => ({
    type: UPLOAD_SUCCESS,
    payload: files,
});

export const uploadError = () => ({
    type: UPLOAD_ERROR,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
