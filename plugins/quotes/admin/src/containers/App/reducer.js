
import constants from './constants';

const {
    QUOTES_LOADING_REQUEST,
    QUOTES_LOADING_SUCCESS,
    QUOTES_LOADING_ERROR,
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_ERROR,
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_ERROR,
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

const initialState = {
    userLoading: false,
    user: {},
    userLoadSuccess: null,
    userLoadError: null,
    quotesLoading: false,
    quotesSuccess: null,
    quotesError: null,
    genresLoading: false,
    genresError: null,
    genres: [],
    quotesExiting: [],
    quotesNew: [],
    quotesDuplicates: [],
    uploadLoading: false,
    uploadRequested: false,
    uploadingDone: false,
};

function quotesLoaderReducer(state = initialState, action) {
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
                user: payload,
                userLoadSuccess: true,
            };

        case USER_LOADING_ERROR:
            return {
                ...state,
                userLoading: false,
                userLoadError: payload,
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
                quotesExiting: payload,
                quotesSuccess: true,
            };

        case QUOTES_LOADING_ERROR:
            return {
                ...state,
                quotesLoading: false,
                quotesError: payload,
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

        case QUOTES_SET:
            return {
                ...state,
                quotesNew: payload.quotesNew ? payload.quotesNew : [],
                quotesDuplicates: payload.quotesDuplicates ? payload.quotesDuplicates : [],
            };

        case QUOTE_REMOVE: {
            const newQuotes = state.quotesNew.slice(0);
            const quoteToRemove = newQuotes.findIndex(item => item === payload);
            if (quoteToRemove !== -1) {
                newQuotes.splice(quoteToRemove, 1);
            }
            return {
                ...state,
                uploadRequested: false,
                quotesNew: newQuotes,
            };
        }

        case QUOTES_START_UPLOAD:
            return {
                ...state,
                uploadLoading: true,
            };

        case QUOTE_UPLOADING_REQUEST: {
            const newQuotes = state.quotesNew.slice(0);
            const uploadingQuote = newQuotes.find(item => (
                item.text === payload.text
                && item.author === payload.author
            ));
            if (uploadingQuote) {
                uploadingQuote.loading = true;
            }
            return {
                ...state,
                uploadRequested: true,
                quotesNew: newQuotes,
            };
        }

        case QUOTE_UPLOADING_SUCCESS: {
            const newQuotes = state.quotesNew.slice(0);
            const uploadingQuote = newQuotes.find(item => item.loading === true);
            if (uploadingQuote) {
                uploadingQuote.loading = false;
                uploadingQuote.uploaded = true;
            }
            return {
                ...state,
                uploadRequested: false,
                quotesNew: newQuotes,
            };
        }

        case QUOTE_UPLOADING_ERROR: {
            const newQuotes = state.quotesNew.slice(0);
            const uploadingQuote = newQuotes.find(item => item.loading === true);
            if (uploadingQuote) {
                uploadingQuote.loading = false;
                uploadingQuote.error = true;
            }
            return {
                ...state,
                uploadLoading: false,
                uploadRequested: false,
                quotesNew: newQuotes,
            };
        }

        case QUOTES_UPLOADING_DONE:
            return {
                ...state,
                uploadLoading: false,
                uploadingDone: true,
            };

        case QUOTES_UPLOADING_CLEAR_STATE:
            return {
                ...state,
                uploadingDone: false,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default quotesLoaderReducer;
