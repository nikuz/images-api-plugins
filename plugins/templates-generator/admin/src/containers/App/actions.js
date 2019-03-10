
import constants from './constants';

const {
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_ERROR,
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_ERROR,
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    CLEAR_STORE,
} = constants;

export const userLoadingRequest = () => ({
    type: USER_LOADING_REQUEST,
});

export const userLoadingSuccess = data => ({
    type: USER_LOADING_SUCCESS,
    payload: data,
});

export const userLoadingError = () => ({
    type: USER_LOADING_ERROR,
});

export const genresLoadingRequest = () => ({
    type: GENRES_LOADING_REQUEST,
});

export const genresLoadingSuccess = data => ({
    type: GENRES_LOADING_SUCCESS,
    payload: data,
});

export const genresLoadingError = error => ({
    type: GENRES_LOADING_ERROR,
    payload: error,
});

export const uploadRequest = file => ({
    type: UPLOAD_REQUEST,
    payload: file,
});

export const uploadSuccess = result => ({
    type: UPLOAD_SUCCESS,
    payload: result,
});

export const uploadError = error => ({
    type: UPLOAD_ERROR,
    payload: error,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
