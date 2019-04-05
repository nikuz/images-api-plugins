
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
    previewVideoEl;

    state = {
        crop: '1080',
        image: null,
        genre: '',
        format: 'jpeg',
        isDragging: false,
        configurator: {},
        configuratorChanged: false,
        tab: 'configurator',
        edit: false,
    };

    componentDidMount() {
        this.props.userLoadingRequest();
        this.props.getGenres();
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.state.edit
            && nextProps.saveResult !== this.props.saveResult
            && nextProps.saveResult !== null
        ) {
            this.setState({
                configurator: nextProps.saveResult,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.genre !== this.state.genre && this.state.tab === 'preview') {
            this.getTemplates();
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    handleTabSelection = (tab) => {
        this.setState({ tab });
        if (tab === 'preview') {
            this.getTemplates();
        }
    };

    getTemplates = () => {
        const { genre } = this.state;

        if (genre === '') {
            strapi.notification.error('templates-generator.Preview.Select-Genre-Error');
            return;
        }

        this.props.getTemplates(genre);
    };

    handleDragEnter = () => this.setState({ isDragging: true });

    handleDragLeave = () => this.setState({ isDragging: false });

    handleFiles = (file) => {
        this.setState({
            image: file,
        });
    };

    handleFileFieldChange = (evt) => {
        this.handleFiles(evt.target.files[0]);
    };

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
            this.handleFiles(suitableFile);
        } else if (strapi) {
            strapi.notification.error('templates-generator.File.format-error');
        }
    };

    handleConfiguratorChange = (data) => {
        const {
            image,
            crop,
            format,
            edit,
            configurator,
        } = this.state;

        let width;
        let height;
        if (format === 'gif' || format === 'mp4') {
            width = 600;
            height = 600;
        } else if (crop === '1024') {
            width = crop;
            height = crop / 2;
        } else {
            width = crop;
            height = crop;
        }

        this.props.clearSaveResult();
        this.setState({
            configurator: {
                ...configurator,
                ...data,
            },
            configuratorChanged: true,
        });
        const props = {
            size: crop,
            format,
            ...data,
            width,
            height,
        };
        if (edit) {
            props.imageURL = `${strapi.backendURL}${configurator.originalImage}`;
        } else if (image) {
            props.file = image;
        }
        this.props.getPreview(props);
    };

    handleCropSizeChange = (e) => {
        this.setState({
            crop: e.target.value,
        });
    };

    handleGenreChange = (e) => {
        const { genres } = this.props;
        this.setState({
            genre: genres.find(item => item.name === e.target.value).id,
        });
    };

    handleFormatChange = (e) => {
        this.props.clearPreviewResult();
        this.setState({
            format: e.target.value,
        });
    };

    handleRefresh = () => {
        if (this.previewVideoEl) {
            this.previewVideoEl.play();
        }
    };

    handleClear = () => {
        this.setState({
            image: null,
            edit: false,
        });
        this.props.clearStore();
        this.props.getGenres();
    };

    handleSave = () => {
        const {
            genre,
            configurator,
            format,
            image,
            edit,
            crop,
        } = this.state;
        const {
            previewResult,
            user,
        } = this.props;

        const arr = previewResult.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        const templateFile = new File([u8arr], `template.${format}`, { type: mime });

        if (genre === '') {
            strapi.notification.error('templates-generator.Save.Select-Genre-Error');
            return;
        }

        if (edit) {
            this.props.update(templateFile, {
                ...configurator,
                genre,
                format,
                crop,
            });
        } else {
            this.props.save(image, templateFile, {
                ...configurator,
                genre,
                format,
                crop,
                user: user._id, // eslint-disable-line
            });
        }
    };

    handleEdit = (template) => {
        this.setState({
            edit: true,
            configurator: template,
            tab: 'configurator',
            format: template.format,
            crop: template.crop,
            configuratorChanged: false,
        });
    };

    handleRemove = (template) => {
        this.props.removeTemplate(
            template.fileId,
            template.originalFileId,
            template.id
        );
    };

    renderTemplates = () => {
        const { genre } = this.state;
        const { templates } = this.props;
        const filteredTemplates = templates.filter(item => (item.genre.id === genre));
        const size = 300;

        return (
            <div className={styles.pluginTemplatesGenerator_previewContainer}>
                { filteredTemplates.map((item) => {
                    const url = `${strapi.backendURL}${item.image}`;
                    return (
                        <div
                            key={item.id}
                            className={styles.pluginTemplatesGenerator_previewContainerItem}
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
                            { !item.loading && (
                                <div
                                    className={
                                        styles.pluginTemplatesGenerator_previewContainerItemCont
                                    }
                                >
                                    <div>
                                        <FormattedMessage id="templates-generator.Preview.Format" />
                                        :&nbsp;
                                        {item.format}
                                    </div>
                                    <div>
                                        <FormattedMessage id="templates-generator.Preview.Filter" />
                                        :&nbsp;
                                        {item.filter}
                                    </div>
                                    <div>
                                        <FormattedMessage id="templates-generator.Preview.TextFontFamily" />
                                        :&nbsp;
                                        {item.textFontFamily}
                                    </div>
                                    <div>
                                        <FormattedMessage id="templates-generator.Preview.AuthorFontFamily" />
                                        :&nbsp;
                                        {item.authorFontFamily}
                                    </div>
                                    <a href={url} target="_blank" />
                                    <Button
                                        label="templates-generator.Preview.Edit"
                                        primary
                                        className={
                                            styles.pluginTemplatesGenerator_previewButtonEdit
                                        }
                                        onClick={() => this.handleEdit(item)}
                                    />
                                    <Button
                                        label="templates-generator.Preview.Remove"
                                        secondaryHotline
                                        className={
                                            styles.pluginTemplatesGenerator_previewButton
                                        }
                                        onClick={() => this.handleRemove(item)}
                                    />
                                </div>
                            ) }
                            { item.loading && (
                                <div
                                    className={
                                        styles.pluginTemplatesGenerator_previewContainerLoading
                                    }
                                >
                                    <LoadingIndicator />
                                </div>
                            ) }
                        </div>
                    );
                }) }
            </div>
        );
    };

    render() {
        const {
            userLoading,
            userError,
            genresLoading,
            genresError,
            genres,
            previewLoading,
            previewError,
            previewResult,
            saveLoading,
            saveError,
            saveResult,
            updateLoading,
            updateError,
            templatesLoading,
            templatesError,
        } = this.props;
        const {
            image,
            crop,
            genre,
            format,
            isDragging,
            tab,
            edit,
            configurator,
            configuratorChanged,
        } = this.state;
        const selectedGenre = genres.find(item => item.id === genre);
        const isPreviewTab = tab === 'preview';
        let previewUrl = previewResult;
        if (edit && !configuratorChanged) {
            previewUrl = `${strapi.backendURL}${configurator.image}`;
        }

        const parametersContainerClassName = cn(
            styles.pluginTemplatesGenerator_parametersContainer,
            isPreviewTab && styles.pluginTemplatesGenerator_parametersContainerPreview
        );
        const fileLoaderContainerClassName = cn(
            styles.pluginTemplatesGenerator_fileLoaderContainer,
            isDragging && styles.pluginTemplatesGenerator_fileLoaderContainerHover
        );
        const resultContainerClassName = styles
            .pluginTemplatesGenerator_configuratorResultContainer;
        const configuratorTabClassName = cn(
            styles.pluginTemplatesGenerator_tab,
            !isPreviewTab && styles.pluginTemplatesGenerator_tabActive
        );
        const previewTabClassName = cn(
            styles.pluginTemplatesGenerator_tab,
            isPreviewTab && styles.pluginTemplatesGenerator_tabActive
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
                    <div className={styles.pluginTemplatesGenerator_tabs}>
                        <div
                            className={configuratorTabClassName}
                            onClick={() => this.handleTabSelection('configurator')}
                        >
                            <FormattedMessage id="templates-generator.Tab.Configurator" />
                        </div>
                        <div
                            className={previewTabClassName}
                            onClick={() => this.handleTabSelection('preview')}
                        >
                            <FormattedMessage id="templates-generator.Tab.Preview" />
                        </div>
                    </div>

                    <div className={parametersContainerClassName}>
                        { !isPreviewTab && (
                            <div>
                                <h3 className={styles.pluginTemplatesGenerator_cropSelectorTitle}>
                                    <FormattedMessage id="templates-generator.Crop.title" />
                                </h3>
                                <div
                                    className={
                                        styles.pluginTemplatesGenerator_cropSelectorContainer
                                    }
                                >
                                    <InputSelect
                                        onChange={this.handleCropSizeChange}
                                        name="cropSize"
                                        value={crop}
                                        selectOptions={['1080', '735', '1024']}
                                        style={selectStyle}
                                    />
                                </div>
                            </div>
                        ) }
                        { !isPreviewTab && (
                            <div>
                                <h3 className={styles.pluginTemplatesGenerator_cropSelectorTitle}>
                                    <FormattedMessage id="templates-generator.Format.title" />
                                </h3>
                                <div
                                    className={
                                        styles.pluginTemplatesGenerator_cropSelectorContainer
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
                        ) }
                        <div>
                            <h3 className={styles.pluginTemplatesGenerator_cropSelectorTitle}>
                                <FormattedMessage id="templates-generator.Genre.title" />
                            </h3>
                            <div className={styles.pluginTemplatesGenerator_cropSelectorContainer}>
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

                    { !image && !edit && !isPreviewTab && (
                        <div className={fileLoaderContainerClassName}>
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
                            <label
                                className={styles.pluginTemplatesGenerator_fileLoaderLabel}
                                onDragEnter={this.handleDragEnter}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={this.handleDrop}
                                htmlFor="images-upload-files"
                            />
                        </div>
                    ) }
                    { (image || edit) && !isPreviewTab && (
                        <div className={styles.pluginTemplatesGenerator_configuratorContainer}>
                            <div className={styles.pluginTemplatesGenerator_configuratorCanvas}>
                                <div className={resultContainerClassName}>
                                    { !previewError && previewUrl && format !== 'mp4' && (
                                        <img
                                            src={previewUrl}
                                            width="500px"
                                            alt=""
                                        />
                                    ) }
                                    { !previewError && !previewLoading && previewUrl && format === 'mp4' && (
                                        <video
                                            ref={el => this.previewVideoEl = el}
                                            width="500px"
                                            autoPlay
                                        >
                                            <source type="video/mp4" src={previewUrl} />
                                        </video>
                                    ) }
                                    { previewLoading && (
                                        <div
                                            className={
                                                styles.pluginTemplatesGenerator_canvasLoading
                                            }
                                        >
                                            <LoadingIndicator />
                                        </div>
                                    ) }
                                    { previewError && previewError.message }
                                </div>
                                <div
                                    className={styles.pluginTemplatesGenerator_configuratorButtons}
                                >
                                    <div
                                        className={
                                            styles.pluginTemplatesGenerator_configuratorButtonsHead
                                        }
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
                                    { previewResult && !saveError && !saveResult && (
                                        <Button
                                            label="templates-generator.Save"
                                            primary
                                            className={
                                                styles.pluginTemplatesGenerator_saveButton
                                            }
                                            onClick={this.handleSave}
                                        />
                                    ) }
                                    { saveError && (
                                        <div>
                                            { saveError.toString() }
                                        </div>
                                    ) }
                                    { saveResult && (
                                        <div
                                            className={
                                                styles.pluginTemplatesGenerator_saveSuccessMessage
                                            }
                                        >
                                            <FormattedMessage
                                                id="templates-generator.Save.Success"
                                            />
                                        </div>
                                    ) }
                                </div>
                            </div>
                            <ImageConfigurator
                                containerClassName={styles.pluginTemplatesGenerator_configurator}
                                translationDomain="templates-generator"
                                text="There is no elevator to success, you have to take the stairs."
                                author="Quote Author"
                                {...configurator}
                                textEffectDisabled={format === 'jpeg'}
                                authorEffectDisabled={format === 'jpeg'}
                                onSubmit={this.handleConfiguratorChange}
                            />
                        </div>
                    ) }

                    { isPreviewTab && this.renderTemplates() }

                    {(
                        userLoading
                        || genresLoading
                        || saveLoading
                        || updateLoading
                        || templatesLoading
                    ) && (
                        <div className={styles.pluginTemplatesGenerator_loading}>
                            <LoadingIndicator />
                        </div>
                    )}
                    { userError && (
                        <div>
                            { userError.toString() }
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
                    { updateError && (
                        <div>
                            { updateError.toString() }
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
    userLoadingRequest: PropTypes.func.isRequired,
    clearStore: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userLoading: PropTypes.bool.isRequired,
    userError: PropTypes.object,
    genres: PropTypes.arrayOf(PropTypes.object).isRequired,
    genresLoading: PropTypes.bool.isRequired,
    genresError: PropTypes.object,
    getGenres: PropTypes.func.isRequired,
    previewLoading: PropTypes.bool.isRequired,
    previewError: PropTypes.object,
    previewResult: PropTypes.string,
    getPreview: PropTypes.func.isRequired,
    clearPreviewResult: PropTypes.func.isRequired,
    saveLoading: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    saveResult: PropTypes.object,
    save: PropTypes.func.isRequired,
    updateLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.object,
    updateResult: PropTypes.object,
    update: PropTypes.func.isRequired,
    clearSaveResult: PropTypes.func.isRequired,
    getTemplates: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.object).isRequired,
    templatesLoading: PropTypes.bool.isRequired,
    templatesError: PropTypes.object,
    removeTemplate: PropTypes.func.isRequired,
};
