
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import ImageConfigurator from '@nikuz/images-configurator';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import Button from 'components/Button';
import Ico from 'components/Ico';
import InputSelect from 'components/InputSelect';

// Styles
import styles from './styles.scss';

export default class App extends React.Component {
    state = {
        crop: '1080',
        image: null,
        genre: '',
        format: 'jpg',
        isDragging: false,
    };

    canvas;

    canvasContainer;

    componentDidMount() {
        this.props.userLoadingRequest();
        this.props.getGenres();
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    handleDragEnter = () => this.setState({ isDragging: true });

    handleDragLeave = () => this.setState({ isDragging: false });

    handleDrop = (evt) => {
        evt.preventDefault();
        this.setState({ isDragging: false });
        let suitableFile;
        for (let i = 0, l = evt.dataTransfer.files.length; i < l; i++) {
            const file = evt.dataTransfer.files[i];
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                suitableFile = file;
                break;
            }
        }

        const strapi = window.strapi;
        if (suitableFile) {
            this.setState({
                image: suitableFile,
            });
        } else if (strapi) {
            strapi.notification.error('templates-generator.File.format-error');
        }
    };

    handleConfiguratorChange = (data) => {
        const {
            image,
            crop,
            genre,
            format,
        } = this.state;

        this.props.upload({
            file: image,
            size: crop,
            genre,
            format,
            ...data,
            width: 500,
            height: 500,
        });
    };

    handleCropSizeChange = (e) => {
        this.setState({
            crop: e.target.value,
        });
    };

    handleGenreChange = (e) => {
        this.setState({
            genre: e.target.value,
        });
    };

    handleFormatChange = (e) => {
        this.setState({
            format: e.target.value,
        });
    };

    handleRefresh = () => {
        if (this.canvas) {
            this.canvas.rerender();
        }
    };

    handleClear = () => {
        this.setState({
            image: null,
        });
        this.props.clearStore();
    };

    render() {
        const {
            userLoading,
            userError,
            genresLoading,
            genresError,
            genres,
            uploadLoading,
            uploadError,
            uploadResult,
        } = this.props;
        const {
            image,
            crop,
            genre,
            format,
            isDragging,
        } = this.state;

        const fileLoaderContainerClassName = cn(
            styles.pluginTemplatesGenerator_fileLoaderContainer,
            isDragging && styles.pluginTemplatesGenerator_fileLoaderContainerHover
        );

        const selectStyle = { minWidth: '170px', maxWidth: '200px' };

        return (
            <ContainerFluid>
                <div className={styles.pluginTemplatesGenerator_container}>
                    <PluginHeader
                        title={{
                            id: 'templates-generator.Title',
                        }}
                        description={{
                            id: 'templates-generator.Description',
                        }}
                    />

                    <div className={styles.pluginTemplatesGenerator_parametersContainer}>
                        <div>
                            <h3 className={styles.pluginTemplatesGenerator_cropSelectorTitle}>
                                <FormattedMessage id="templates-generator.Crop.title" />
                            </h3>
                            <div className={styles.pluginTemplatesGenerator_cropSelectorContainer}>
                                <InputSelect
                                    onChange={this.handleCropSizeChange}
                                    name="cropSize"
                                    value={crop}
                                    selectOptions={['1080', '735', '1024']}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.pluginTemplatesGenerator_cropSelectorTitle}>
                                <FormattedMessage id="templates-generator.Format.title" />
                            </h3>
                            <div className={styles.pluginTemplatesGenerator_cropSelectorContainer}>
                                <InputSelect
                                    onChange={this.handleFormatChange}
                                    name="format"
                                    value={format}
                                    selectOptions={['jpg', 'gif', 'mp4']}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.pluginImagesUploader_cropSelectorTitle}>
                                <FormattedMessage id="templates-generator.Genre.title" />
                            </h3>
                            <div className={styles.pluginImagesUploader_cropSelectorContainer}>
                                <InputSelect
                                    onChange={this.handleGenreChange}
                                    name="genre"
                                    value={genre}
                                    selectOptions={[''].concat(genres).map(item => item.name)}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                    </div>

                    { !image && (
                        <label
                            className={fileLoaderContainerClassName}
                            onDragEnter={this.handleDragEnter}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={this.handleDrop}
                            htmlFor="images-upload-files"
                        >
                            <div>
                                <div className={styles.icon}>
                                    <Ico icoType="image" />
                                </div>
                                <p className={styles.textWrapper}>
                                    <FormattedMessage id="templates-generator.Upload.text" />
                                </p>
                                <div
                                    onDragLeave={this.handleDragLeave}
                                    className={
                                        cn(isDragging && styles.pluginTemplatesGenerator_blocker)
                                    }
                                />
                                <input
                                    name="images-upload-files"
                                    id="images-upload-files"
                                    onChange={this.handleFileFieldChange}
                                    multiple
                                    type="file"
                                    accept=".jpg,.jpeg"
                                />
                            </div>
                        </label>
                    ) }
                    { image && (
                        <div className={styles.pluginTemplatesGenerator_configuratorContainer}>
                            <div className={styles.pluginTemplatesGenerator_configuratorCanvas}>
                                <div>
                                    { uploadResult && (
                                        <img src={uploadResult} alt="" />
                                    ) }
                                    { uploadLoading && (
                                        <div
                                            className={
                                                styles.pluginTemplatesGenerator_canvasLoading
                                            }
                                        >
                                            <LoadingIndicator />
                                        </div>
                                    ) }
                                    { uploadError && uploadError.message }
                                </div>
                                <div
                                    className={styles.pluginTemplatesGenerator_configuratorButtons}
                                >
                                    <Button
                                        label="templates-generator.Refresh"
                                        secondaryHotline
                                        onClick={this.handleRefresh}
                                    />
                                    <Button
                                        label="templates-generator.Clear"
                                        secondaryHotline
                                        className={
                                            styles.pluginTemplatesGenerator_configuratorClear
                                        }
                                        onClick={this.handleClear}
                                    />
                                </div>
                            </div>
                            <ImageConfigurator
                                containerClassName={styles.pluginTemplatesGenerator_configurator}
                                {...this.configuratorProps}
                                translationDomain="templates-generator"
                                textEffectDisabled={format === 'jpg'}
                                authorEffectDisabled={format === 'jpg'}
                                onSubmit={this.handleConfiguratorChange}
                            />
                        </div>
                    ) }

                    {(userLoading || genresLoading) && (
                        <div className={styles.pluginTemplatesGenerator_loading}>
                            <LoadingIndicator />
                        </div>
                    )}
                    { userError || genresError }
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
    clearStore: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userLoading: PropTypes.bool.isRequired,
    userError: PropTypes.object,
    genres: PropTypes.arrayOf(PropTypes.object).isRequired,
    genresLoading: PropTypes.bool.isRequired,
    genresError: PropTypes.object,
    getGenres: PropTypes.func.isRequired,
    uploadLoading: PropTypes.bool.isRequired,
    uploadError: PropTypes.object,
    uploadResult: PropTypes.string,
    upload: PropTypes.func.isRequired,
};
