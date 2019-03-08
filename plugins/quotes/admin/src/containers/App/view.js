
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import PluginHeaderTitle from 'components/PluginHeaderTitle';
import LoadingIndicator from 'components/LoadingIndicator';
import LoadingBar from 'components/LoadingBar';
import Button from 'components/Button';
import Ico from 'components/Ico';

import styles from './styles.scss';
import tsvIcon from '../../icons/tsv.svg';

export default class App extends React.PureComponent {
    state = {
        isDraging: false,
    };

    componentDidMount() {
        this.props.quotesLoadingRequest();
        this.props.userLoadingRequest();
    }

    componentDidUpdate(prevProps) {
        const {
            uploadLoading,
            uploadRequested,
            quotesNew,
            uploadingDone,
            quotesError,
            userError,
        } = this.props;
        const strapi = window.strapi;

        if (uploadLoading && !uploadRequested) {
            const notUploadedQuote = quotesNew.find(item => item.uploaded === false);
            if (notUploadedQuote) {
                this.props.quoteUploadRequest(notUploadedQuote);
            } else {
                this.props.quotesUploadDone();
            }
        }

        if (uploadingDone) {
            if (strapi) {
                strapi.notification.success('quotes.Uploading.done');
            }
            this.props.clearUploadingState();
        }

        if (!prevProps.quotesError && quotesError && strapi) {
            strapi.notification.error('quotes.Quotes.error');
        }
        if (!prevProps.userError && userError && strapi) {
            strapi.notification.error('quotes.User.error');
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    readFile = (file) => {
        const { quotesExiting } = this.props;
        const reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (() => (
            (e) => {
                const lines = e.target.result.split('\n');
                const quotesNew = [];
                const quotesDuplicates = [];
                lines.forEach((line) => {
                    const data = line.split(/\t/);
                    const text = data[0];
                    const author = data[1];
                    const genre = data[2];

                    if (author !== undefined) {
                        quotesNew.push({
                            author: author.trim(),
                            text: text.trim(),
                            genre: genre || 'inspitarion',
                            loading: false,
                            uploaded: false,
                            error: null,
                        });
                        // console.log(text);
                        // console.log(author);
                        // console.log(genre);
                        // console.log('=======');
                    }
                });
                if (quotesNew.length) {
                    const filteredQuotesNew = quotesNew.filter((item) => {
                        const duplicate = quotesExiting.find(exitingItem => (
                            exitingItem.text === item.text
                            && exitingItem.author === item.author
                        ));
                        if (duplicate) {
                            quotesDuplicates.push(duplicate);
                            return false;
                        }

                        return true;
                    });
                    this.props.setQuotes(filteredQuotesNew, quotesDuplicates);
                }
            }
        ))(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    };

    handleFileFieldChange = (evt) => {
        const files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (let i = 0, l = files.length; i < l; i++) {
            this.readFile(files[i]);
        }
    };

    handleDragEnter = () => this.setState({ isDraging: true });

    handleDragLeave = () => this.setState({ isDraging: false });

    handleDrop = (evt) => {
        evt.preventDefault();
        this.setState({ isDraging: false });
        const file = evt.dataTransfer.files[0];
        const strapi = window.strapi;
        if (file.type === 'text/tab-separated-values') {
            this.readFile(file);
        } else if (strapi) {
            strapi.notification.error('quotes.File.format-error');
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.uploadStart();
    };

    renderQuote = (quote, key, duplicate = false) => {
        const className = cn(
            styles.pluginQuotesLoader_quotesListItem,
            duplicate && styles.pluginQuotesLoader_quotesListItemDuplicate
        );
        return (
            <li key={key} className={className}>
                <p>{quote.text}</p>
                <i>{quote.author}</i>
                <span className={styles.pluginQuotesLoader_quotesListItemGenre}>
                    &nbsp;&ndash;&nbsp;
                    {quote.genre}
                </span>

                {!quote.loading && !quote.uploaded && !quote.error && !duplicate && (
                    <div className={styles.pluginQuotesLoader_quotesListDelete}>
                        <Ico icoType="trash" />
                        <div
                            className={styles.pluginQuotesLoader_blocker}
                            onClick={() => this.props.removeQuote(quote)}
                        />
                    </div>
                )}

                {quote.loading && (
                    <LoadingBar
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    />
                )}

                {quote.uploaded && (
                    <div className={styles.pluginQuotesLoader_quotesListCheck}>
                        <Ico icoType="check" />
                    </div>
                )}

                {quote.error && (
                    <div className={styles.pluginQuotesLoader_quotesListError}>
                        <Ico icoType="exclamation-triangle" />
                    </div>
                )}
            </li>
        );
    };

    render() {
        const {
            quotesLoading,
            userLoading,
            uploadLoading,
            quotesNew,
            quotesDuplicates,
        } = this.props;
        const { isDraging } = this.state;
        const fileLoaderContainerClassName = cn(
            styles.pluginQuotesLoader_fileLoaderContainer,
            isDraging && styles.pluginQuotesLoader_fileLoaderContainerHover
        );

        return (
            <ContainerFluid>
                <div className={styles.pluginQuotesLoader_container}>
                    <PluginHeader
                        title={{
                            id: 'quotes.HomePage.title',
                        }}
                        description={{
                            id: 'quotes.HomePage.description',
                        }}
                    />
                    {!quotesNew.length && !quotesDuplicates.length && (
                        <label
                            htmlFor="quotes-files"
                            className={fileLoaderContainerClassName}
                            onDragEnter={this.handleDragEnter}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={this.handleDrop}
                        >
                            <div>
                                <img
                                    src={tsvIcon}
                                    className={styles.icon}
                                    alt=""
                                />
                                <p className={styles.textWrapper}>
                                    <FormattedMessage id="quotes.Upload.text" />
                                </p>
                                <div
                                    onDragLeave={this.handleDragLeave}
                                    className={cn(isDraging && styles.pluginQuotesLoader_blocker)}
                                />
                                <input
                                    name="quotes-files"
                                    id="quotes-files"
                                    onChange={this.handleFileFieldChange}
                                    type="file"
                                    accept=".tsv"
                                />
                            </div>
                        </label>
                    )}

                    {!!quotesNew.length && (
                        <form
                            onSubmit={this.handleSubmit}
                            className={styles.pluginQuotesLoader_form}
                        >
                            <PluginHeaderTitle
                                title={{
                                    id: 'quotes.New.title',
                                }}
                            />
                            <Button
                                label="quotes.Upload.button"
                                type="submit"
                                primary
                                loader={uploadLoading}
                            />
                        </form>
                    )}
                    <ol className={styles.pluginQuotesLoader_quotesList}>
                        {quotesNew.map((item, key) => this.renderQuote(item, key))}
                    </ol>

                    {!!quotesDuplicates.length && (
                        <PluginHeaderTitle
                            title={{
                                id: 'quotes.Duplicates.title',
                            }}
                        />
                    )}
                    <ol className={styles.pluginQuotesLoader_quotesList}>
                        {quotesDuplicates.map((item, key) => this.renderQuote(item, key, true))}
                    </ol>

                    {(quotesLoading || userLoading) && (
                        <div className={styles.pluginQuotesLoader_loading}>
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
    quotesLoading: PropTypes.bool.isRequired,
    quotesError: PropTypes.bool,
    userLoading: PropTypes.bool.isRequired,
    userError: PropTypes.bool,
    quotesExiting: PropTypes.array.isRequired,
    quotesNew: PropTypes.array.isRequired,
    quotesDuplicates: PropTypes.array.isRequired,
    uploadLoading: PropTypes.bool.isRequired,
    quotesLoadingRequest: PropTypes.func.isRequired,
    userLoadingRequest: PropTypes.func.isRequired,
    setQuotes: PropTypes.func.isRequired,
    uploadStart: PropTypes.func.isRequired,
    quoteUploadRequest: PropTypes.func.isRequired,
    quotesUploadDone: PropTypes.func.isRequired,
    clearUploadingState: PropTypes.func.isRequired,
    uploadRequested: PropTypes.bool.isRequired,
    clearStore: PropTypes.func.isRequired,
    uploadingDone: PropTypes.bool.isRequired,
    removeQuote: PropTypes.func.isRequired,
};
