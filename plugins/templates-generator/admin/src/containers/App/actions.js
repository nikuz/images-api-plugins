
import constants from './constants';

const {
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_FAILURE,
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_FAILURE,
    PREVIEW_REQUEST,
    PREVIEW_SUCCESS,
    PREVIEW_FAILURE,
    PREVIEW_CLEAR_RESULT,
    SAVE_REQUEST,
    SAVE_SUCCESS,
    SAVE_FAILURE,
    UPDATE_REQUEST,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    SAVE_CLEAR_RESULT,
    TEMPLATES_REQUEST,
    TEMPLATES_SUCCESS,
    TEMPLATES_FAILURE,
    TEMPLATES_REMOVE_REQUEST,
    TEMPLATES_REMOVE_SUCCESS,
    TEMPLATES_REMOVE_FAILURE,
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
    type: USER_LOADING_FAILURE,
});

export const genresLoadingRequest = () => ({
    type: GENRES_LOADING_REQUEST,
});

export const genresLoadingSuccess = data => ({
    type: GENRES_LOADING_SUCCESS,
    payload: data,
});

export const genresLoadingError = error => ({
    type: GENRES_LOADING_FAILURE,
    payload: error,
});

export const previewRequest = file => ({
    type: PREVIEW_REQUEST,
    payload: file,
});

export const previewSuccess = result => ({
    type: PREVIEW_SUCCESS,
    payload: result,
});

export const previewError = error => ({
    type: PREVIEW_FAILURE,
    payload: error,
});

export const clearPreviewResult = () => ({
    type: PREVIEW_CLEAR_RESULT,
});

export const saveRequest = (originalFile, templatePreview, template) => ({
    type: SAVE_REQUEST,
    payload: {
        originalFile,
        templatePreview,
        template,
    },
});

export const saveSuccess = result => ({
    type: SAVE_SUCCESS,
    payload: result,
});

export const saveError = error => ({
    type: SAVE_FAILURE,
    payload: error,
});

export const updateRequest = (templatePreview, template) => ({
    type: UPDATE_REQUEST,
    payload: {
        templatePreview,
        template,
    },
});

export const updateSuccess = result => ({
    type: UPDATE_SUCCESS,
    payload: result,
});

export const updateError = error => ({
    type: UPDATE_FAILURE,
    payload: error,
});

export const clearSaveResult = () => ({
    type: SAVE_CLEAR_RESULT,
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
    type: TEMPLATES_FAILURE,
    payload: error,
});

export const removeTemplateRequest = (fileId, originalFileId, templateId) => ({
    type: TEMPLATES_REMOVE_REQUEST,
    payload: {
        fileId,
        originalFileId,
        templateId,
    },
});

export const removeTemplateSuccess = result => ({
    type: TEMPLATES_REMOVE_SUCCESS,
    payload: result,
});

export const removeTemplateError = (templateId, error) => ({
    type: TEMPLATES_REMOVE_FAILURE,
    payload: {
        templateId,
        error,
    },
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
