
import constants from './constants';

const {
    UPLOAD_REQUEST,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    CLEAR_STORE,
} = constants;

const initialState = {
    loading: false,
    files: [],
    error: null,
};

function packGeneratorReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case UPLOAD_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case UPLOAD_SUCCESS: {
            let files = state.files.slice(0);
            if (payload) {
                files = [].concat(files).concat(payload);
            }
            return {
                ...state,
                loading: false,
                files,
            };
        }

        case UPLOAD_ERROR:
            return {
                ...state,
                loading: false,
                error: payload,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default packGeneratorReducer;
