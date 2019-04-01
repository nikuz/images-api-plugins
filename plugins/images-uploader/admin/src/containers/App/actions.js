
import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_FAILURE,
    FILES_SET,
    UPLOAD_START,
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    UPLOAD_DONE,
    UPLOAD_CLEAR_STATE,
    UPLOADED_IMAGES_REQUEST,
    UPLOADED_IMAGES_SUCCESS,
    UPLOADED_IMAGES_FAILURE,
    REMOVE_IMAGE_REQUEST,
    REMOVE_IMAGE_SUCCESS,
    REMOVE_IMAGE_FAILURE,
    CLEAR_STORE,
} = constants;

export const genresLoadingRequest = () => ({
    type: GENRES_LOADING_REQUEST,
});

export const genresLoadingSuccess = data => ({
    type: GENRES_LOADING_SUCCESS,
    payload: data,
});

export const genresLoadingFailure = error => ({
    type: GENRES_LOADING_FAILURE,
    payload: error,
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

export const uploadError = error => ({
    type: UPLOAD_ERROR,
    payload: error,
});

export const uploadDone = () => ({
    type: UPLOAD_DONE,
});

export const uploadClearState = () => ({
    type: UPLOAD_CLEAR_STATE,
});

export const getUploadedImagesRequest = genre => ({
    type: UPLOADED_IMAGES_REQUEST,
    payload: genre,
});

export const getUploadedImagesSuccess = images => ({
    type: UPLOADED_IMAGES_SUCCESS,
    payload: images,
});

export const getUploadedImagesFailure = error => ({
    type: UPLOADED_IMAGES_FAILURE,
    payload: error,
});

export const removeImageRequest = (imageId, fileId) => ({
    type: REMOVE_IMAGE_REQUEST,
    payload: {
        imageId,
        fileId,
    },
});

export const removeImageSuccess = imageId => ({
    type: REMOVE_IMAGE_SUCCESS,
    payload: {
        imageId,
    },
});

export const removeImageFailure = (imageId, error) => ({
    type: REMOVE_IMAGE_FAILURE,
    payload: {
        imageId,
        error,
    },
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
