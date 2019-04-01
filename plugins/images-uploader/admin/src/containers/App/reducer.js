
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

const initialState = {
    loading: false,
    files: [],
    error: null,
    genres: [],
    uploadLoading: false,
    uploadRequested: false,
    uploadingDone: false,
    uploadedImages: [],
    uploadedImagesLoading: false,
    uploadedImagesError: null,
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

        case GENRES_LOADING_FAILURE:
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

        case UPLOADED_IMAGES_REQUEST:
            return {
                ...state,
                uploadedImagesLoading: true,
            };

        case UPLOADED_IMAGES_SUCCESS:
            return {
                ...state,
                uploadedImages: payload,
                uploadedImagesLoading: false,
            };

        case UPLOADED_IMAGES_FAILURE:
            return {
                ...state,
                uploadedImagesError: payload,
                uploadedImagesLoading: false,
            };

        case REMOVE_IMAGE_REQUEST: {
            const images = state.uploadedImages.slice(0);
            const removingImage = images.find(item => item.id === payload.imageId);
            if (removingImage) {
                removingImage.loading = true;
            }
            return {
                ...state,
                removeImageLoading: true,
                uploadedImages: images,
            };
        }

        case REMOVE_IMAGE_SUCCESS: {
            const images = state.uploadedImages.slice(0);
            const removingImage = images.findIndex(item => item.id === payload.imageId);
            if (removingImage !== -1) {
                images.splice(removingImage, 1);
            }
            return {
                ...state,
                removeImageLoading: false,
                uploadedImages: images,
            };
        }

        case REMOVE_IMAGE_FAILURE: {
            const images = state.uploadedImages.slice(0);
            const removingImage = images.find(item => item.id === payload.imageId);
            if (removingImage) {
                removingImage.loading = false;
                removingImage.error = true;
            }
            return {
                ...state,
                removeImageLoading: false,
                removeAllRequested: false,
                uploadedImages: images,
            };
        }

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default packGeneratorReducer;
