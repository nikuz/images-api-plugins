
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { bindActionCreators, compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import View from './view';

import {
    ordersRequest,
    ordersCountRequest,
    genresRequest,
    deleteRequest,
    clearStore,
} from './actions';

import {
    getOrders,
    getOrdersLoading,
    getOrdersError,
    getOrdersCount,
    getOrdersCountLoading,
    getOrdersCountError,
    getGenres,
    getGenresLoading,
    getGenresError,
    getOrdersDeleteLoading,
    getOrdersDeleteError,
    getOrderDeletedSuccessfully,
} from './selectors';

import reducer from './reducer';
import saga from './saga';

const mapStateToProps = createStructuredSelector({
    orders: getOrders(),
    ordersLoading: getOrdersLoading(),
    ordersError: getOrdersError(),
    ordersCount: getOrdersCount(),
    ordersCountLoading: getOrdersCountLoading(),
    ordersCountError: getOrdersCountError(),
    genres: getGenres(),
    genresLoading: getGenresLoading(),
    genresError: getGenresError(),
    ordersDeleteLoading: getOrdersDeleteLoading(),
    ordersDeleteError: getOrdersDeleteError(),
    orderDeletedSuccessfully: getOrderDeletedSuccessfully(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        getOrders: ordersRequest,
        getOrdersCount: ordersCountRequest,
        getGenres: genresRequest,
        deleteOrder: deleteRequest,
        clearStore,
    },
    dispatch
);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'ordersManagerReducer', reducer });
const withSaga = injectSaga({ key: 'ordersManager', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(injectIntl(View));
