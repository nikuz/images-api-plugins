
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
    saveLoading: false,
    saveError: null,
    saveResult: null,
    templates: [],
    templatesLoading: false,
    templatesError: null,
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

        case UPLOAD_CLEAR_RESULT:
            return {
                ...state,
                uploadResult: null,
            };

        case SAVE_REQUEST:
            return {
                ...state,
                saveLoading: true,
                saveError: null,
                saveResult: null,
            };

        case SAVE_SUCCESS:
            return {
                ...state,
                saveLoading: false,
                saveResult: payload,
            };

        case SAVE_ERROR:
            return {
                ...state,
                saveLoading: false,
                saveError: payload,
            };

        case SAVE_CLEAR_RESULT:
            return {
                ...state,
                saveResult: null,
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

        case TEMPLATES_REMOVE_REQUEST: {
            const templates = state.templates.slice(0);
            const removingTemplate = templates.find(item => (
                item.id === payload.templateId
            ));
            if (removingTemplate) {
                removingTemplate.loading = true;
            }
            return {
                ...state,
                templates,
            };
        }

        case TEMPLATES_REMOVE_ERROR: {
            const templates = state.templates.slice(0);
            const removingTemplate = templates.find(item => (
                item.id === payload.templateId
            ));
            if (removingTemplate) {
                removingTemplate.loading = false;
                removingTemplate.error = payload.error;
            }
            return {
                ...state,
                templates,
            };
        }

        case TEMPLATES_REMOVE_SUCCESS: {
            const templates = state.templates.slice(0);
            const removingTemplateIndex = templates.findIndex(item => (
                item.id === payload.id
            ));
            if (removingTemplateIndex !== -1) {
                templates.splice(removingTemplateIndex, 1);
            }
            return {
                ...state,
                templates,
            };
        }

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default templatesGeneratorReducer;
