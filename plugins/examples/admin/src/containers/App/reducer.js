
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

const initialState = {
    genresLoading: false,
    genresError: null,
    genres: [],
    templates: [],
    templatesLoading: false,
    templatesError: null,
    example: null,
    exampleLoading: false,
    exampleError: null,
};

function templatesGeneratorReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
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

        case TEMPLATES_REQUEST:
            return {
                ...state,
                templatesLoading: true,
                templatesError: null,
            };

        case TEMPLATES_SUCCESS:
            return {
                ...state,
                templatesLoading: false,
                templates: payload,
            };

        case TEMPLATES_ERROR:
            return {
                ...state,
                templatesLoading: false,
                templatesError: payload,
            };

        case EXAMPLE_REQUEST:
            return {
                ...state,
                exampleLoading: true,
                exampleError: null,
            };

        case EXAMPLE_SUCCESS:
            return {
                ...state,
                exampleLoading: false,
                example: payload && payload.example,
            };

        case EXAMPLE_ERROR:
            return {
                ...state,
                exampleLoading: false,
                exampleError: payload,
            };

        case EXAMPLE_CLEAR:
            return {
                ...state,
                example: null,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default templatesGeneratorReducer;
