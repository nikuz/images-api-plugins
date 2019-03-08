
import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_ERROR,
    FILES_SET,
    UPLOAD_START,
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    UPLOAD_DONE,
    UPLOAD_CLEAR_STATE,
    CLEAR_STORE,
} = constants;

export const genresLoadingRequest = () => ({
    type: GENRES_LOADING_REQUEST,
});

export const genresLoadingSuccess = data => ({
    type: GENRES_LOADING_SUCCESS,
    payload: data,
});

export const genresLoadingError = () => ({
    type: GENRES_LOADING_ERROR,
});

export const setFiles = files => ({
    type: FILES_SET,
    payload: files,
});

export const uploadStart = () => ({
    type: UPLOAD_START,
});

export const uploadRequest = file => ({
    type: UPLOAD_REQUEST,
    payload: file,
});

export const uploadSuccess = files => ({
    type: UPLOAD_SUCCESS,
    payload: files,
});

export const uploadError = () => ({
    type: UPLOAD_ERROR,
});

export const uploadDone = () => ({
    type: UPLOAD_DONE,
});

export const uploadClearState = () => ({
    type: UPLOAD_CLEAR_STATE,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
