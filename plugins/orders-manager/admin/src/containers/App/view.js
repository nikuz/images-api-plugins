
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import PageFooter from 'components/PageFooter';
import PopUpWarning from 'components/PopUpWarning';
import Ico from 'components/Ico';

import * as commonUtils from '../../utils/common';

// Styles
import styles from './styles.scss';

export default class App extends React.Component {
    state = {
        _page: 1,
        _limit: 10,
        removePromptOpenedFor: null,
    };

    componentDidMount() {
        const {
            _limit,
            _page,
        } = this.state;

        this.props.getOrdersCount();
        this.props.getOrders(_limit, (_page - 1) * _limit);
        this.props.getGenres();
    }

    componentWillReceiveProps(nextProps) {
        const {
            _limit,
            _page,
        } = this.state;

        if (nextProps.orderDeletedSuccessfully && !this.props.orderDeletedSuccessfully) {
            this.props.getOrdersCount();
            this.props.getOrders(_limit, (_page - 1) * _limit);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            _limit,
            _page,
        } = this.state;

        if (prevState._limit !== _limit || prevState._page !== _page) { // eslint-disable-line
            this.props.getOrders(_limit, (_page - 1) * _limit);
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    handleFooterChangeParams = (e) => {
        let name;
        if (e.target.name.indexOf('_limit') !== -1) {
            name = '_limit';
        }
        if (e.target.name.indexOf('_page') !== -1) {
            name = '_page';
        }

        if (name) {
            this.setState({
                [name]: e.target.value,
            });
        }
    };

    handleOrderOpen = (orderId) => {
        this.context.router.history.push(
            `/plugins/content-manager/orders/${orderId}?source=content-manager`
        );
    };

    renderOrder = (orderItem) => {
        const { genres } = this.props;
        const { removePromptOpenedFor } = this.state;
        const id = orderItem.id;
        const createdAt = new Date(orderItem.createdAt);
        const genre = genres.find(item => item.id === orderItem.genre);

        return (
            <tbody key={id}>
                <tr
                    className={styles.pluginOrdersManager_listRow}
                    onClick={() => this.handleOrderOpen(id)}
                >
                    <td>{id}</td>
                    <td>{orderItem.format}</td>
                    <td>{orderItem.crop}</td>
                    <td>{orderItem.logo ? 'yes' : 'no'}</td>
                    <td>{orderItem.copyright ? 'yes' : 'no'}</td>
                    <td>
                        {commonUtils.zeroPadding(createdAt.getDate())}
                        /
                        {commonUtils.zeroPadding(createdAt.getMonth() + 1)}
                        /
                        {createdAt.getFullYear()}
                        &nbsp;
                        {commonUtils.zeroPadding(createdAt.getHours())}
                        :
                        {commonUtils.zeroPadding(createdAt.getMinutes())}
                    </td>
                    <td>{genre && genre.name}</td>
                    <td>{orderItem.status}</td>
                    <td align="right">
                        <div className={styles.pluginOrdersManager_listRowRemoveIcon}>
                            <Ico icoType="trash" />
                            <div
                                className={styles.pluginOrdersManager_listRowRemoveIconBlocker}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.setState({
                                        removePromptOpenedFor: id,
                                    });
                                }}
                            />
                        </div>
                        <PopUpWarning
                            isOpen={removePromptOpenedFor === id}
                            toggleModal={() => (
                                this.setState({
                                    removePromptOpenedFor: null,
                                })
                            )}
                            popUpWarningType="danger"
                            onConfirm={() => this.props.deleteOrder(orderItem)}
                        />
                    </td>
                </tr>
            </tbody>
        );
    };

    render() {
        const {
            orders,
            ordersLoading,
            ordersError,
            ordersCount,
            ordersCountLoading,
            ordersCountError,
            genresLoading,
            genresError,
            ordersDeleteLoading,
            ordersDeleteError,
        } = this.props;
        const {
            _page,
            _limit,
        } = this.state;

        return (
            <ContainerFluid>
                <div className={styles.pluginOrdersManager_container}>
                    <PluginHeader
                        title={{
                            id: 'orders-manager.Title',
                        }}
                        description={{
                            id: 'orders-manager.Description',
                        }}
                    />
                    { (
                        ordersLoading
                        || ordersCountLoading
                        || genresLoading
                        || ordersDeleteLoading
                    ) && (
                        <div className={styles.pluginOrdersManager_loading}>
                            <LoadingIndicator />
                        </div>
                    ) }
                    { ordersError && (
                        <div>
                            { ordersError.toString() }
                        </div>
                    ) }
                    { ordersCountError && (
                        <div>
                            { ordersCountError.toString() }
                        </div>
                    ) }
                    { genresError && (
                        <div>
                            { genresError.toString() }
                        </div>
                    ) }
                    { ordersDeleteError && (
                        <div>
                            { ordersDeleteError.toString() }
                        </div>
                    ) }
                    <table className={styles.pluginOrdersManager_list}>
                        <thead>
                            <tr className={styles.pluginOrdersManager_listHeadRow}>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.ID" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Format" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Crop" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Logo" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Copyright" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.CreatedAt" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Genre" />
                                </th>
                                <th>
                                    <FormattedMessage id="orders-manager.Order.Status" />
                                </th>
                                <th />
                            </tr>
                        </thead>
                        { orders.map(this.renderOrder) }
                    </table>
                    <PageFooter
                        count={ordersCount}
                        params={{
                            _page,
                            _limit,
                        }}
                        onChangeParams={this.handleFooterChangeParams}
                        style={{
                            margin: '2.5rem 0',
                        }}
                    />
                </div>
            </ContainerFluid>
        );
    }
}

App.contextTypes = {
    router: PropTypes.object,
};

App.propTypes = {
    getOrders: PropTypes.func.isRequired,
    getOrdersCount: PropTypes.func.isRequired,
    orders: PropTypes.arrayOf(PropTypes.object).isRequired,
    ordersLoading: PropTypes.bool.isRequired,
    ordersError: PropTypes.object,
    ordersCount: PropTypes.number.isRequired,
    ordersCountLoading: PropTypes.bool.isRequired,
    ordersCountError: PropTypes.object,
    genres: PropTypes.arrayOf(PropTypes.object).isRequired,
    genresLoading: PropTypes.bool.isRequired,
    genresError: PropTypes.object,
    getGenres: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    ordersDeleteLoading: PropTypes.bool.isRequired,
    ordersDeleteError: PropTypes.object,
    orderDeletedSuccessfully: PropTypes.bool.isRequired,
    clearStore: PropTypes.func.isRequired,
};
