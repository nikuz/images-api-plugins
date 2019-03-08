
import constants from './constants';

const {
    GENRES_LOADING_REQUEST,
    GENRES_LOADING_SUCCESS,
    GENRES_LOADING_ERROR,
    FILES_SET,
    UPLOAD_START,
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    UPLOAD_DONE,
    UPLOAD_CLEAR_STATE,
    CLEAR_STORE,
} = constants;

const initialState = {
    loading: false,
    files: [],
    error: null,
    genres: [],
    uploadLoading: false,
    uploadRequested: false,
    uploadingDone: false,
};

function packGeneratorReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GENRES_LOADING_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case GENRES_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                genres: payload,
            };

        case GENRES_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                error: payload,
            };

        case FILES_SET:
            return {
                ...state,
                files: payload,
            };

        case UPLOAD_START:
            return {
                ...state,
                uploadLoading: true,
            };

        case UPLOAD_REQUEST: {
            const files = state.files.slice(0);
            const uploadingFile = files.find(item => (
                item.file === payload.file
            ));
            if (uploadingFile) {
                uploadingFile.loading = true;
            }
            return {
                ...state,
                uploadRequested: true,
                files,
            };
        }

        case UPLOAD_SUCCESS: {
            const files = state.files.slice(0);
            const uploadingFile = files.find(item => item.loading === true);
            if (uploadingFile) {
                uploadingFile.loading = false;
                uploadingFile.uploaded = true;
                uploadingFile.file = payload[0];
            }
            return {
                ...state,
                uploadRequested: false,
                files,
            };
        }

        case UPLOAD_ERROR: {
            const files = state.files.slice(0);
            const uploadingFile = files.find(item => item.loading === true);
            if (uploadingFile) {
                uploadingFile.loading = false;
                uploadingFile.error = true;
            }
            return {
                ...state,
                uploadLoading: false,
                uploadRequested: false,
                files,
            };
        }

        case UPLOAD_DONE:
            return {
                ...state,
                uploadLoading: false,
                uploadingDone: true,
            };

        case UPLOAD_CLEAR_STATE:
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

export default packGeneratorReducer;
