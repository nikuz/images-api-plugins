
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import InputSelect from 'components/InputSelect';
import Button from 'components/Button';
import Slider from 'components/Slider';

// Styles
import styles from './styles.scss';

export default class App extends React.Component {
    state = {
        packSize: '30',
        pack: [],
    };

    componentDidMount() {
        this.props.userLoadingRequest();
        this.props.imagesLoadingRequest();
        this.props.quotesLoadingRequest();
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    packSizeOnChange = (e) => {
        this.setState({
            packSize: e.target.value,
        });
    };

    handleGenerate = () => {
        const {
            images,
            quotes,
        } = this.props;
        const { packSize } = this.state;
        const pack = [];
        let quote;
        let image;

        const getQuoteDuplicate = item => (
            item.text === quote.text || item.author === quote.author
        );

        const getImageDuplicate = item => (
            item.url === image.url
        );

        for (let i = 0; i < packSize; i++) {
            if (packSize < quotes.length / 2) {
                while (!quote) {
                    quote = quotes[Math.floor(Math.random() * quotes.length)];
                    const quoteDuplicate = pack.find(getQuoteDuplicate);
                    if (quoteDuplicate) {
                        quote = undefined;
                    }
                }
            } else {
                quote = quotes[Math.floor(Math.random() * quotes.length)];
            }
            if (packSize < images.length / 2) {
                while (!quote) {
                    image = images[Math.floor(Math.random() * images.length)];
                    if (pack.find(getImageDuplicate)) {
                        image = undefined;
                    }
                }
            } else {
                image = images[Math.floor(Math.random() * images.length)];
            }

            pack.push({
                author: quote.author,
                text: quote.text,
                image: image.url,
                generateTime: Date.now(),
            });
        }

        this.setState({ pack });
    };

    renderPackItem = item => (
        <div>
            <div>{item.author}</div>
            <div>{item.text}</div>
            <div>{item.image}</div>
        </div>
    );

    render() {
        const {
            userLoading,
            imagesLoading,
            quotesLoading,
        } = this.props;
        const {
            packSize,
            pack,
        } = this.state;

        const selectStyle = { minWidth: '170px', maxWidth: '200px' };

        return (
            <ContainerFluid>
                <div className={styles.pluginPackGenerator_container}>
                    <PluginHeader
                        title={{
                            id: 'pack-generator.Title',
                        }}
                        description={{
                            id: 'pack-generator.Description',
                        }}
                    />

                    <h3 className={styles.pluginPackGenerator_packSelectorTitle}>
                        <FormattedMessage id="pack-generator.Pack-Selector.title" />
                    </h3>
                    <div className={styles.pluginPackGenerator_packSelectorContainer}>
                        <InputSelect
                            onChange={this.packSizeOnChange}
                            name="packSize"
                            value={packSize}
                            selectOptions={['30', '180', '360']}
                            style={selectStyle}
                        />
                        <Button
                            label="pack-generator.Generate.button"
                            primary
                            onClick={this.handleGenerate}
                        />
                    </div>
                    <Slider items={pack} />

                    {(userLoading || imagesLoading || quotesLoading) && (
                        <div className={styles.pluginPackGenerator_loading}>
                            <LoadingIndicator />
                        </div>
                    )}
                </div>
            </ContainerFluid>
        );
    }
}

App.contextTypes = {
    router: PropTypes.object,
};

App.propTypes = {
    userLoadingRequest: PropTypes.func.isRequired,
    imagesLoadingRequest: PropTypes.func.isRequired,
    quotesLoadingRequest: PropTypes.func.isRequired,
    clearStore: PropTypes.func.isRequired,
    // user: PropTypes.object.isRequired,
    userLoading: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    imagesLoading: PropTypes.bool.isRequired,
    quotes: PropTypes.array.isRequired,
    quotesLoading: PropTypes.bool.isRequired,
};
