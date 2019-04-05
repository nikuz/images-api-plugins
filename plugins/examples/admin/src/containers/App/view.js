
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import InputSelect from 'components/InputSelect';

// Styles
import styles from './styles.scss';

const exampleSize = 500;

export default class App extends React.Component {
    previewVideoEl;

    state = {
        genre: '',
        format: 'jpeg',
        selectedTemplates: [],
    };

    componentDidMount() {
        this.props.getGenres();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.genre !== this.state.genre) {
            this.getTemplates();
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    getTemplates = () => {
        const { genre } = this.state;

        if (genre === '') {
            strapi.notification.error('examples.Select-Genre-Error');
            return;
        }

        this.props.getTemplates(genre);
    };

    handleGenreChange = (e) => {
        const { genres } = this.props;
        this.props.clearExample();
        this.setState({
            genre: genres.find(item => item.name === e.target.value).id,
        });
    };

    handleFormatChange = (e) => {
        this.props.clearExample();
        this.setState({
            format: e.target.value,
        });
    };

    handleGetExample = (template) => {
        const { genres } = this.props;
        const { genre } = this.state;
        const selectedTemplates = this.state.selectedTemplates.slice(0);
        const templateIsSelected = selectedTemplates.findIndex(item => item === template.id);
        if (templateIsSelected !== -1) {
            selectedTemplates.splice(templateIsSelected, 1);
        } else {
            selectedTemplates.push(template.id);
        }

        this.setState(() => ({ selectedTemplates }));
        if (selectedTemplates.length === 0) {
            return;
        }

        const selectedGenre = genres.find(item => item.id === genre);

        this.props.clearExample();

        const props = {
            templates: selectedTemplates,
            genre: selectedGenre && selectedGenre.id,
        };
        delete props.image;
        Object.keys(props).forEach((key) => {
            if (key.indexOf('_') !== -1) {
                delete props[key];
            }
        });

        this.props.getExample(props);
    };

    renderTemplates = () => {
        const {
            selectedTemplates,
            format,
        } = this.state;
        const { templates } = this.props;
        const filteredTemplates = templates.filter(item => (item.format === format));
        const size = 200;

        return (
            <div className={styles.pluginExamples_previewContainer}>
                { filteredTemplates.map((item) => {
                    const url = `${strapi.backendURL}${item.image}`;
                    const selected = selectedTemplates.includes(item.id);
                    const className = cn(
                        styles.pluginExamples_previewContainerItem,
                        selected && styles.pluginExamples_previewContainerItemActive
                    );
                    return (
                        <div
                            key={item.id}
                            className={className}
                            onClick={() => this.handleGetExample(item)}
                        >
                            {item.format === 'mp4' && (
                                <video
                                    width={`${size}px`}
                                    autoPlay
                                    controls
                                >
                                    <source type="video/mp4" src={url} />
                                </video>
                            )}
                            {item.format !== 'mp4' && (
                                <img
                                    src={url}
                                    width={`${size}px`}
                                    alt=""
                                />
                            )}
                            <div
                                className={
                                    styles.pluginExamples_previewContainerItemCont
                                }
                            >
                                <div>
                                    <FormattedMessage id="examples.Format" />
                                    :&nbsp;
                                    {item.format}
                                </div>
                                <div>
                                    <FormattedMessage id="examples.Filter" />
                                    :&nbsp;
                                    {item.filter}
                                </div>
                                <div>
                                    <FormattedMessage id="examples.TextFontFamily" />
                                    :&nbsp;
                                    {item.textFontFamily}
                                </div>
                                <div>
                                    <FormattedMessage id="examples.AuthorFontFamily" />
                                    :&nbsp;
                                    {item.authorFontFamily}
                                </div>
                            </div>
                        </div>
                    );
                }) }
            </div>
        );
    };

    render() {
        const {
            genresLoading,
            genresError,
            genres,
            templatesLoading,
            templatesError,
            example,
            exampleLoading,
            exampleError,
        } = this.props;
        const {
            genre,
            format,
        } = this.state;
        const selectedGenre = genres.find(item => item.id === genre);
        const selectStyle = { minWidth: '170px', maxWidth: '200px' };

        return (
            <ContainerFluid>
                <div className={styles.pluginExamples_container}>
                    <PluginHeader
                        title={{
                            id: 'examples.Title',
                        }}
                        description={{
                            id: 'examples.Description',
                        }}
                    />
                    <div className={styles.pluginExamples_parametersContainer}>
                        <div>
                            <h3 className={styles.pluginExamples_cropSelectorTitle}>
                                <FormattedMessage id="examples.Format.title" />
                            </h3>
                            <div
                                className={
                                    styles.pluginExamples_cropSelectorContainer
                                }
                            >
                                <InputSelect
                                    onChange={this.handleFormatChange}
                                    name="format"
                                    value={format}
                                    selectOptions={['jpeg', 'gif', 'mp4']}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.pluginExamples_cropSelectorTitle}>
                                <FormattedMessage id="examples.Genre.title" />
                            </h3>
                            <div className={styles.pluginExamples_cropSelectorContainer}>
                                <InputSelect
                                    onChange={this.handleGenreChange}
                                    name="genre"
                                    value={selectedGenre ? selectedGenre.name : ''}
                                    selectOptions={[''].concat(genres).map(item => item.name)}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                    </div>

                    { this.renderTemplates() }

                    <div>
                        <PluginHeader
                            title={{
                                id: 'examples.Preview.Title',
                            }}
                        />
                        {!example && (
                            <FormattedMessage id="examples.Preview.No-Preview-Available" />
                        )}
                        <div style={{ height: `${exampleSize}px`, marginBottom: '2rem' }}>
                            {example && format === 'mp4' && (
                                <video
                                    width={`${exampleSize}px`}
                                    autoPlay
                                    controls
                                >
                                    <source type="video/mp4" src={example} />
                                </video>
                            )}
                            {example && format !== 'mp4' && (
                                <img
                                    src={example}
                                    width={`${exampleSize}px`}
                                    alt=""
                                />
                            )}
                            { exampleLoading && <LoadingIndicator /> }
                        </div>
                    </div>

                    { (genresLoading || templatesLoading || exampleLoading) && (
                        <div className={styles.pluginExamples_loading}>
                            <LoadingIndicator />
                        </div>
                    ) }
                    { genresError && (
                        <div>
                            { genresError.toString() }
                        </div>
                    ) }
                    { templatesError && (
                        <div>
                            { templatesError.toString() }
                        </div>
                    ) }
                    { exampleError && (
                        <div>
                            { exampleError.toString() }
                        </div>
                    ) }
                </div>
            </ContainerFluid>
        );
    }
}

App.contextTypes = {
    router: PropTypes.object,
};

App.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.object).isRequired,
    genresLoading: PropTypes.bool.isRequired,
    genresError: PropTypes.object,
    getGenres: PropTypes.func.isRequired,
    getTemplates: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.object).isRequired,
    templatesLoading: PropTypes.bool.isRequired,
    templatesError: PropTypes.object,
    example: PropTypes.string,
    getExample: PropTypes.func.isRequired,
    exampleLoading: PropTypes.bool.isRequired,
    exampleError: PropTypes.object,
    clearExample: PropTypes.func.isRequired,
    clearStore: PropTypes.func.isRequired,
};
