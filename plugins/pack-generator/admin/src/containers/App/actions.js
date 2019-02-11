
import constants from './constants';

const {
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_ERROR,
    IMAGES_LOADING_REQUEST,
    IMAGES_LOADING_SUCCESS,
    IMAGES_LOADING_ERROR,
    QUOTES_LOADING_REQUEST,
    QUOTES_LOADING_SUCCESS,
    QUOTES_LOADING_ERROR,
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

export const imagesLoadingRequest = () => ({
    type: IMAGES_LOADING_REQUEST,
});

export const imagesLoadingSuccess = data => ({
    type: IMAGES_LOADING_SUCCESS,
    payload: data,
});

export const imagesLoadingError = () => ({
    type: IMAGES_LOADING_ERROR,
});

export const quotesLoadingRequest = () => ({
    type: QUOTES_LOADING_REQUEST,
});

export const quotesLoadingSuccess = data => ({
    type: QUOTES_LOADING_SUCCESS,
    payload: data,
});

export const quotesLoadingError = () => ({
    type: QUOTES_LOADING_ERROR,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
