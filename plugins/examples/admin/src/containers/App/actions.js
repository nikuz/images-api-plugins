
import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_ERROR,
    TEMPLATES_REQUEST,
    TEMPLATES_SUCCESS,
    TEMPLATES_ERROR,
    EXAMPLE_REQUEST,
    EXAMPLE_SUCCESS,
    EXAMPLE_ERROR,
    EXAMPLE_CLEAR,
    CLEAR_STORE,
} = constants;

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

export const getTemplatesRequest = genre => ({
    type: TEMPLATES_REQUEST,
    payload: genre,
});

export const getTemplatesSuccess = result => ({
    type: TEMPLATES_SUCCESS,
    payload: result,
});

export const getTemplatesError = error => ({
    type: TEMPLATES_ERROR,
    payload: error,
});

export const getExampleRequest = template => ({
    type: EXAMPLE_REQUEST,
    payload: template,
});

export const getExampleSuccess = result => ({
    type: EXAMPLE_SUCCESS,
    payload: result,
});

export const getExampleError = error => ({
    type: EXAMPLE_ERROR,
    payload: error,
});

export const clearExample = error => ({
    type: EXAMPLE_CLEAR,
    payload: error,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
