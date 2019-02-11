
import constants from './constants';

const {
    QUOTES_LOADING_REQUEST,
    QUOTES_LOADING_SUCCESS,
    QUOTES_LOADING_ERROR,
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_ERROR,
    QUOTES_SET,
    QUOTE_REMOVE,
    QUOTES_START_UPLOAD,
    QUOTE_UPLOADING_REQUEST,
    QUOTE_UPLOADING_SUCCESS,
    QUOTE_UPLOADING_ERROR,
    QUOTES_UPLOADING_DONE,
    QUOTES_UPLOADING_CLEAR_STATE,
    CLEAR_STORE,
} = constants;

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

export const setQuotes = (quotesNew, quotesDuplicates) => ({
    type: QUOTES_SET,
    payload: {
        quotesNew,
        quotesDuplicates,
    },
});

export const removeQuote = quote => ({
    type: QUOTE_REMOVE,
    payload: quote,
});

export const uploadStart = () => ({
    type: QUOTES_START_UPLOAD,
});

export const quoteUploadRequest = quote => ({
    type: QUOTE_UPLOADING_REQUEST,
    payload: quote,
});

export const quoteUploadSuccess = () => ({
    type: QUOTE_UPLOADING_SUCCESS,
});

export const quoteUploadError = () => ({
    type: QUOTE_UPLOADING_ERROR,
});

export const quotesUploadDone = () => ({
    type: QUOTES_UPLOADING_DONE,
});

export const clearUploadingState = () => ({
    type: QUOTES_UPLOADING_CLEAR_STATE,
});

export const clearStore = () => ({
    type: CLEAR_STORE,
});
