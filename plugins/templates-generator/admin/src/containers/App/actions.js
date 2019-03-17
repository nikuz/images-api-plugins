
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
    UPLOAD_CLEAR_RESULT,
    SAVE_REQUEST,
    SAVE_SUCCESS,
    SAVE_ERROR,
    SAVE_CLEAR_RESULT,
    TEMPLATES_REQUEST,
    TEMPLATES_SUCCESS,
    TEMPLATES_ERROR,
    TEMPLATES_REMOVE_REQUEST,
    TEMPLATES_REMOVE_SUCCESS,
    TEMPLATES_REMOVE_ERROR,
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

export const clearUploadResult = () => ({
    type: UPLOAD_CLEAR_RESULT,
});

export const saveRequest = data => ({
    type: SAVE_REQUEST,
    payload: data,
});

export const saveSuccess = result => ({
    type: SAVE_SUCCESS,
    payload: result,
});

export const saveError = error => ({
    type: SAVE_ERROR,
    payload: error,
});

export const clearSaveResult = () => ({
    type: SAVE_CLEAR_RESULT,
});

export const getTemplatesRequest = () => ({
    type: TEMPLATES_REQUEST,
});

export const getTemplatesSuccess = result => ({
    type: TEMPLATES_SUCCESS,
    payload: result,
});

export const getTemplatesError = error => ({
    type: TEMPLATES_ERROR,
    payload: error,
});

export const removeTemplateRequest = (fileId, templateId) => ({
    type: TEMPLATES_REMOVE_REQUEST,
    payload: {
        fileId,
        templateId,
    },
});

export const removeTemplateSuccess = result => ({
    type: TEMPLATES_REMOVE_SUCCESS,
    payload: result,
});

export const removeTemplateError = (templateId, error) => ({
    type: TEMPLATES_REMOVE_ERROR,
    payload: {
        templateId,
        error,
    },
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
