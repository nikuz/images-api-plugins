
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import PluginHeaderTitle from 'components/PluginHeaderTitle';
import LoadingIndicator from 'components/LoadingIndicator';
import InputSelect from 'components/InputSelect';
import Button from 'components/Button';
import LoadingBar from 'components/LoadingBar';
import Ico from 'components/Ico';

// Styles
import styles from './styles.scss';

export default class App extends React.Component {
    state = {
        crop: '1080',
        genre: '',
        isDraging: false,
        tab: 'upload',
    };

    componentDidMount() {
        this.props.getGenres();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            uploadLoading,
            uploadRequested,
            files,
            uploadingDone,
        } = this.props;
        const strapi = window.strapi;

        if (uploadLoading && !uploadRequested) {
            const notUploadedImage = files.find(item => item.uploaded === false);
            if (notUploadedImage) {
                const genre = this.state.genre;
                const genreItem = this.props.genres.find(item => item.id === genre);
                this.props.uploadRequest({
                    file: notUploadedImage.file,
                    size: this.state.crop,
                    genre: genreItem.id,
                });
            } else {
                this.props.uploadDone();
            }
        }

        if (uploadingDone) {
            if (strapi) {
                strapi.notification.success('images-uploader.Uploading.done');
            }
            this.props.uploadClearState();
        }

        if (prevState.genre !== this.state.genre && this.state.tab === 'preview') {
            this.getUploadedImages();
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { genre } = this.state;
        const strapi = window.strapi;

        if (genre === '' && strapi) {
            strapi.notification.error('images-uploader.Genre.no-selection-error');
        } else {
            this.props.uploadStart();
        }
    };

    getUploadedImages = () => {
        const { genre } = this.state;

        if (genre === '') {
            strapi.notification.error('images-uploader.Preview.Select-Genre-Error');
            return;
        }

        this.props.getUploadedImages(genre);
    };

    handleTabSelection = (tab) => {
        this.setState({ tab });
        if (tab === 'preview') {
            this.getUploadedImages();
        }
    };

    handleFiles = (files) => {
        this.props.setFiles(Object.keys(files).map(item => ({
            file: files[item],
            uploaded: false,
        })));
    };

    handleFileFieldChange = (evt) => {
        this.handleFiles(evt.target.files);
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

    handleDragEnter = () => this.setState({ isDraging: true });

    handleDragLeave = () => this.setState({ isDraging: false });

    handleDrop = (evt) => {
        evt.preventDefault();
        this.setState({ isDraging: false });
        const files = [];
        for (let i = 0, l = evt.dataTransfer.files.length; i < l; i++) {
            const file = evt.dataTransfer.files[i];
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                files.push(file);
            }
        }

        const strapi = window.strapi;
        if (files.length) {
            this.handleFiles(files);
        } else if (strapi) {
            strapi.notification.error('images-uploader.File.format-error');
        }
    };

    sortUploadedImages = (a, b) => {
        const aCreatedAt = new Date(a.createdAt);
        const bCreatedAt = new Date(b.createdAt);

        if (aCreatedAt < bCreatedAt) {
            return 1;
        }
        if (aCreatedAt > bCreatedAt) {
            return -1;
        }

        return 0;
    };

    handleRemove = (item) => {
        this.props.removeImage(item.id, item.fileId);
    };

    renderFile = (item) => {
        // createdAt: "2019-02-11T08:10:08.510Z"
        // ext: ".jpg"
        // hash: "8e70837683784cfcb25bd3016a0271d5"
        // id: "5c612de0078aed0e45c9a6b5"
        // mime: "image/jpeg"
        // name: "upload_d1017c155eeceed40da84d615fef5cfd.jpg"
        // provider: "local"
        // related: []
        // sha256: "k9ODTj3hqkrJBP5WnDvyv9b3vPfSf1GK5VMbfiC-5uY"
        // size: "3.55"
        // updatedAt: "2019-02-11T08:10:08.512Z"
        // url: "http://localhost:1337/uploads/8e70837683784cfcb25bd3016a0271d5.jpg"
        // __v: 0
        // _id: "5c612de0078aed0e45c9a6b5"
        const file = item.file;

        return (
            <div
                key={file._id || file.name} // eslint-disable-line
                className={styles.pluginImagesUploader_fileItem}
            >
                { item.uploaded && (
                    <div>
                        <img src={file.url} width="50" alt="" />
                    </div>
                ) }
                { !item.uploaded && (
                    <div>
                        { file.name }
                    </div>
                ) }
                { item.uploaded && (
                    <span className={styles.pluginImagesUploader_fileItemSize}>
                        {file.size}
                        &nbsp;
                        Kb
                    </span>
                ) }

                { item.loading && (
                    <LoadingBar
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    />
                ) }

                { item.uploaded && (
                    <div className={styles.pluginImagesUploader_fileItemCheck}>
                        <Ico icoType="check" />
                    </div>
                ) }

                { item.error && (
                    <div className={styles.pluginImagesUploader_fileItemError}>
                        <Ico icoType="exclamation-triangle" />
                    </div>
                ) }
                { item.uploaded && (
                    <a
                        href={file.url}
                        target="_blank"
                        className={styles.pluginImagesUploader_blocker}
                    />
                ) }
            </div>
        );
    };

    renderUploadedFile = (item) => {
        // createdAt: "2019-04-01T08:07:58.197Z"
        // crop: 1080
        // fileId: "5ca1c6de083e42516f1a8a62"
        // genre: "5c72e9bb5dd7d3514fd0940f"
        // id: "5ca1c6de083e42516f1a8a63"
        // size: 70.45
        // updatedAt: "2019-04-01T08:07:58.201Z"
        // url: "/uploads/48880dc85b114aafb028930fbc88ab2e.jpg"
        // __v: 0
        // _id: "5ca1c6de083e42516f1a8a63"
        const url = `${strapi.backendURL}${item.url}`;

        return (
            <div
                key={item._id || item.name} // eslint-disable-line
                className={styles.pluginImagesUploader_fileItem}
            >
                <div>
                    <a href={url} target="_blank">
                        <img src={url} width="50" alt="" />
                    </a>
                </div>
                <div className={styles.pluginImagesUploader_fileItemSize}>
                    <div className={styles.pluginImagesUploader_greenAccent}>
                        {item.size}
                        &nbsp;
                        Kb
                    </div>
                    <div>
                        {item.crop}
                    </div>
                </div>

                { item.loading && (
                    <LoadingBar
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                ) }

                { item.error && (
                    <div className={styles.pluginImagesUploader_fileItemError}>
                        <Ico icoType="exclamation-triangle" />
                    </div>
                ) }

                { !item.loading && !item.error && (
                    <Button
                        label="images-uploader.Preview.Remove"
                        secondaryHotline
                        className={
                            styles.pluginImagesUploader_previewContainerButton
                        }
                        onClick={() => this.handleRemove(item)}
                    />
                ) }
            </div>
        );
    };

    render() {
        const {
            loading,
            files,
            error,
            genres,
            uploadedImages,
            uploadedImagesLoading,
            uploadedImagesError,
            uploadLoading,
        } = this.props;
        const {
            crop,
            genre,
            isDraging,
            tab,
        } = this.state;
        const selectedGenre = genres.find(item => item.id === genre);
        const notUploadedImage = files.find(item => item.uploaded === false);
        const fileLoaderContainerClassName = cn(
            styles.pluginImagesUploader_fileLoaderContainer,
            isDraging && styles.pluginImagesUploader_fileLoaderContainerHover
        );
        const isPreviewTab = tab === 'preview';
        const uploadTabClassName = cn(
            styles.pluginImagesUploader_tab,
            !isPreviewTab && styles.pluginImagesUploader_tabActive
        );
        const previewTabClassName = cn(
            styles.pluginImagesUploader_tab,
            isPreviewTab && styles.pluginImagesUploader_tabActive
        );

        const selectStyle = { minWidth: '170px', maxWidth: '200px' };

        return (
            <ContainerFluid>
                <div className={styles.pluginImagesUploader_container}>
                    <PluginHeader
                        title={{
                            id: 'images-uploader.Title',
                        }}
                        description={{
                            id: 'images-uploader.Description',
                        }}
                    />
                    <div className={styles.pluginImagesUploader_tabs}>
                        <div
                            className={uploadTabClassName}
                            onClick={() => this.handleTabSelection('upload')}
                        >
                            <FormattedMessage id="images-uploader.Tab.Upload" />
                        </div>
                        <div
                            className={previewTabClassName}
                            onClick={() => this.handleTabSelection('preview')}
                        >
                            <FormattedMessage id="images-uploader.Tab.Preview" />
                        </div>
                    </div>

                    <div className={styles.pluginImagesUploader_parametersContainer}>
                        <div>
                            <h3 className={styles.pluginImagesUploader_cropSelectorTitle}>
                                <FormattedMessage id="images-uploader.Crop.title" />
                            </h3>
                            <div className={styles.pluginImagesUploader_cropSelectorContainer}>
                                <InputSelect
                                    onChange={this.handleCropSizeChange}
                                    name="cropSize"
                                    value={crop}
                                    selectOptions={['1080', '1920', '2040']}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.pluginImagesUploader_cropSelectorTitle}>
                                <FormattedMessage id="images-uploader.Genre.title" />
                            </h3>
                            <div className={styles.pluginImagesUploader_cropSelectorContainer}>
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

                    { !isPreviewTab && !files.length && (
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
                                    <FormattedMessage id="images-uploader.Upload.text" />
                                </p>
                                <div
                                    onDragLeave={this.handleDragLeave}
                                    className={cn(isDraging && styles.pluginImagesUploader_blocker)}
                                />
                                <input
                                    name="images-upload-files"
                                    id="images-upload-files"
                                    onChange={this.handleFileFieldChange}
                                    multiple
                                    type="file"
                                    accept=".jpg,.jpeg"
                                    disabled={loading}
                                />
                            </div>
                        </label>
                    ) }
                    { error && (
                        <div>
                            { error.toString() }
                        </div>
                    ) }
                    { uploadedImagesError && (
                        <div>
                            { uploadedImagesError.toString() }
                        </div>
                    ) }
                    { !isPreviewTab && !!files.length && (
                        <form
                            onSubmit={this.handleSubmit}
                            className={styles.pluginImagesUploader_form}
                        >
                            <PluginHeaderTitle
                                title={{
                                    id: 'images-uploader.Images-List.title',
                                }}
                            />
                            { notUploadedImage && (
                                <Button
                                    label="images-uploader.Images-List.upload"
                                    type="submit"
                                    primary
                                    loader={uploadLoading}
                                />
                            ) }
                        </form>
                    ) }
                    { !isPreviewTab && files.map(this.renderFile) }
                    { isPreviewTab && (
                        <div className={styles.pluginImagesUploader_previewAmount}>
                            <FormattedMessage
                                id="images-uploader.Preview.Amount-Total"
                                values={{
                                    amount: uploadedImages.length,
                                }}
                            />
                        </div>
                    ) }
                    { isPreviewTab && (
                        uploadedImages
                            .sort(this.sortUploadedImages)
                            .map(this.renderUploadedFile)
                    ) }
                    { (loading || uploadedImagesLoading) && (
                        <div className={styles.pluginImagesUploader_loading}>
                            <LoadingIndicator />
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
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    genres: PropTypes.arrayOf(PropTypes.object).isRequired,
    uploadLoading: PropTypes.bool.isRequired,
    uploadRequested: PropTypes.bool.isRequired,
    uploadingDone: PropTypes.bool.isRequired,
    getGenres: PropTypes.func.isRequired,
    setFiles: PropTypes.func.isRequired,
    uploadStart: PropTypes.func.isRequired,
    uploadRequest: PropTypes.func.isRequired,
    uploadDone: PropTypes.func.isRequired,
    uploadClearState: PropTypes.func.isRequired,
    getUploadedImages: PropTypes.func.isRequired,
    uploadedImages: PropTypes.arrayOf(PropTypes.object).isRequired,
    uploadedImagesLoading: PropTypes.bool.isRequired,
    uploadedImagesError: PropTypes.object,
    removeImage: PropTypes.func.isRequired,
    clearStore: PropTypes.func.isRequired,
};
