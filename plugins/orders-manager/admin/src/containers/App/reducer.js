
import constants from './constants';

const {
    ORDERS_GET_REQUEST,
    ORDERS_GET_SUCCESS,
    ORDERS_GET_FAILURE,
    ORDERS_GET_COUNT_REQUEST,
    ORDERS_GET_COUNT_SUCCESS,
    ORDERS_GET_COUNT_FAILURE,
    GENRES_GET_REQUEST,
    GENRES_GET_SUCCESS,
    GENRES_GET_FAILURE,
    ORDERS_DELETE_REQUEST,
    ORDERS_DELETE_SUCCESS,
    ORDERS_DELETE_FAILURE,
    CLEAR_STORE,
} = constants;

const initialState = {
    ordersLoading: false,
    ordersError: null,
    orders: [],
    ordersCountLoading: false,
    ordersCountError: null,
    ordersCount: 0,
    genres: [],
    genresLoading: false,
    genresError: null,
    orderDeletedSuccessfully: false,
    ordersDeleteLoading: false,
    ordersDeleteError: null,
};

function ordersManagerReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ORDERS_GET_REQUEST:
            return {
                ...state,
                orderDeletedSuccessfully: false,
                ordersLoading: true,
            };

        case ORDERS_GET_SUCCESS:
            return {
                ...state,
                orders: payload,
                ordersLoading: false,
            };

        case ORDERS_GET_FAILURE:
            return {
                ...state,
                ordersLoading: false,
                ordersError: payload,
            };

        case ORDERS_GET_COUNT_REQUEST:
            return {
                ...state,
                ordersCountLoading: true,
            };

        case ORDERS_GET_COUNT_SUCCESS:
            return {
                ...state,
                ordersCount: payload,
                ordersCountLoading: false,
            };

        case ORDERS_GET_COUNT_FAILURE:
            return {
                ...state,
                ordersCountLoading: false,
                ordersCountError: payload,
            };

        case GENRES_GET_REQUEST:
            return {
                ...state,
                genresLoading: true,
            };

        case GENRES_GET_SUCCESS:
            return {
                ...state,
                genres: payload,
                genresLoading: false,
            };

        case GENRES_GET_FAILURE:
            return {
                ...state,
                genresLoading: false,
                genresError: payload,
            };

        case ORDERS_DELETE_REQUEST:
            return {
                ...state,
                ordersDeleteLoading: true,
            };

        case ORDERS_DELETE_SUCCESS:
            return {
                ...state,
                orderDeletedSuccessfully: true,
                ordersDeleteLoading: false,
            };

        case ORDERS_DELETE_FAILURE:
            return {
                ...state,
                ordersDeleteLoading: false,
                ordersDeleteError: payload,
            };

        case CLEAR_STORE:
            return initialState;

        default:
            return state;
    }
}

export default ordersManagerReducer;
