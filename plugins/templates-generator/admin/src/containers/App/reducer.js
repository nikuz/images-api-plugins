
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

const initialState = {
    userLoading: false,
    userError: null,
    user: {},
    genresLoading: false,
    genresError: null,
    genres: [],
    uploadLoading: false,
    uploadError: null,
    uploadResult: null,
};

function templatesGeneratorReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADING_REQUEST:
            return {
                ...state,
                userLoading: true,
                userError: null,
            };

        case USER_LOADING_SUCCESS:
            return {
                ...state,
                userLoading: false,
                user: payload || {},
            };

        case USER_LOADING_ERROR:
            return {
                ...state,
                userLoading: false,
                userError: payload,
            };

        case GENRES_LOADING_REQUEST:
            return {
                ...state,
                genresLoading: true,
                genresError: null,
            };

        case GENRES_LOADING_SUCCESS:
            return {
                ...state,
                genresLoading: false,
                genres: payload,
            };

        case GENRES_LOADING_ERROR:
            return {
                ...state,
                genresLoading: false,
                genresError: payload,
            };

        case UPLOAD_REQUEST:
            return {
                ...state,
                uploadLoading: true,
                uploadError: null,
            };

        case UPLOAD_SUCCESS:
            return {
                ...state,
                uploadLoading: false,
                uploadResult: payload.image,
            };

        case UPLOAD_ERROR:
            return {
                ...state,
                uploadLoading: false,
                uploadError: payload,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default templatesGeneratorReducer;
