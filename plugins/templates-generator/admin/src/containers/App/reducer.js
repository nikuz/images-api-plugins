
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
    SAVE_CLEAR_RESULT,
    UPDATE_REQUEST,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    TEMPLATES_REQUEST,
    TEMPLATES_SUCCESS,
    TEMPLATES_FAILURE,
    TEMPLATES_REMOVE_REQUEST,
    TEMPLATES_REMOVE_SUCCESS,
    TEMPLATES_REMOVE_FAILURE,
    CLEAR_STORE,
} = constants;

const initialState = {
    userLoading: false,
    userError: null,
    user: {},
    genresLoading: false,
    genresError: null,
    genres: [],
    previewLoading: false,
    previewError: null,
    previewResult: null,
    saveLoading: false,
    saveError: null,
    saveResult: null,
    updateLoading: false,
    updateError: null,
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

        case USER_LOADING_FAILURE:
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

        case GENRES_LOADING_FAILURE:
            return {
                ...state,
                genresLoading: false,
                genresError: payload,
            };

        case PREVIEW_REQUEST:
            return {
                ...state,
                previewLoading: true,
                previewError: null,
            };

        case PREVIEW_SUCCESS:
            return {
                ...state,
                previewLoading: false,
                previewResult: payload.image,
            };

        case PREVIEW_FAILURE:
            return {
                ...state,
                previewLoading: false,
                previewError: payload,
            };

        case PREVIEW_CLEAR_RESULT:
            return {
                ...state,
                previewResult: null,
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

        case SAVE_FAILURE:
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

        case UPDATE_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            };

        case UPDATE_SUCCESS:
            return {
                ...state,
                updateLoading: false,
                saveResult: payload,
            };

        case UPDATE_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: payload,
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

        case TEMPLATES_FAILURE:
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

        case TEMPLATES_REMOVE_FAILURE: {
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
