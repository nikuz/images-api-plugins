
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
    };

    componentDidMount() {
        this.props.getGenres();
    }

    componentDidUpdate() {
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
                const genreItem = this.props.genres.find(item => item.name === genre);
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
        this.setState({
            genre: e.target.value,
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

    renderFile = (item) => {
        const file = item.file;
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

    render() {
        const {
            loading,
            files,
            error,
            genres,
        } = this.props;
        const {
            crop,
            genre,
            isDraging,
        } = this.state;
        const fileLoaderContainerClassName = cn(
            styles.pluginImagesUploader_fileLoaderContainer,
            isDraging && styles.pluginImagesUploader_fileLoaderContainerHover
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
                                    value={genre}
                                    selectOptions={[''].concat(genres).map(item => item.name)}
                                    style={selectStyle}
                                />
                            </div>
                        </div>
                    </div>

                    { !files.length && (
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
                    { error }
                    { !!files.length && (
                        <form
                            onSubmit={this.handleSubmit}
                            className={styles.pluginImagesUploader_form}
                        >
                            <PluginHeaderTitle
                                title={{
                                    id: 'images-uploader.Images-List.title',
                                }}
                            />
                            <Button
                                label="images-uploader.Images-List.upload"
                                type="submit"
                                primary
                                loader={loading}
                            />
                        </form>
                    ) }
                    { files.map(this.renderFile) }
                    { loading && (
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
    clearStore: PropTypes.func.isRequired,
};
