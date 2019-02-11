
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

const initialState = {
    userLoading: false,
    userLoadingError: null,
    user: {},
    imagesLoading: false,
    imagesLoadingError: null,
    images: [],
    quotesLoading: false,
    quotesLoadingError: null,
    quotes: [],
};

function packGeneratorReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADING_REQUEST:
            return {
                ...state,
                userLoading: true,
            };

        case USER_LOADING_SUCCESS:
            return {
                ...state,
                userLoading: false,
                user: payload || {},
                userLoadSuccess: true,
            };

        case USER_LOADING_ERROR:
            return {
                ...state,
                userLoading: false,
                userLoadError: payload,
            };

        case IMAGES_LOADING_REQUEST:
            return {
                ...state,
                imagesLoading: true,
            };

        case IMAGES_LOADING_SUCCESS:
            return {
                ...state,
                imagesLoading: false,
                images: payload || [],
                imagesSuccess: true,
            };

        case IMAGES_LOADING_ERROR:
            return {
                ...state,
                imagesLoading: false,
                imagesError: payload,
            };

        case QUOTES_LOADING_REQUEST:
            return {
                ...state,
                quotesLoading: true,
            };

        case QUOTES_LOADING_SUCCESS:
            return {
                ...state,
                quotesLoading: false,
                quotes: payload || [],
                quotesSuccess: true,
            };

        case QUOTES_LOADING_ERROR:
            return {
                ...state,
                quotesLoading: false,
                quotesError: payload,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default packGeneratorReducer;
