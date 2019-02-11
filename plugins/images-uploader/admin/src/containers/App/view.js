
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';

import ContainerFluid from 'components/ContainerFluid';
import PluginHeader from 'components/PluginHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import InputSelect from 'components/InputSelect';
import Ico from 'components/Ico';

// Styles
import styles from './styles.scss';

export default class App extends React.Component {
    state = {
        crop: '1080',
        isDraging: false,
    };

    componentDidMount() {
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    handleFiles = (files) => {
        const formData = Object.keys(files).reduce((acc, current) => {
            acc.append('files', files[current]);
            return acc;
        }, new FormData());
        formData.append('size', this.state.crop);

        this.props.uploadRequest(formData);
    };

    handleFileFieldChange = (evt) => {
        this.handleFiles(evt.target.files);
    };

    handleCropSizeChange = (e) => {
        this.setState({
            crop: e.target.value,
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

    renderFile = file => (
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
        <div
            key={file._id} // eslint-disable-line
            className={styles.pluginImagesUploader_fileItem}
        >
            <div>
                <img src={file.url} width="50" alt="" />
            </div>
            <span className={styles.pluginImagesUploader_fileItemSize}>
                {file.size}
                &nbsp;
                Kb
            </span>
            <div className={styles.pluginImagesUploader_fileItemCheck}>
                <Ico icoType="check" />
            </div>
            <a
                href={file.url}
                target="_blank"
                className={styles.pluginImagesUploader_blocker}
            />
        </div>
    );

    render() {
        const {
            loading,
            files,
            error,
        } = this.props;
        const {
            crop,
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
                    { loading && (
                        <div className={styles.pluginImagesUploader_loading}>
                            <LoadingIndicator />
                        </div>
                    ) }
                    { error }
                    { files.map(this.renderFile) }
                </div>
            </ContainerFluid>
        );
    }
}

App.contextTypes = {
    router: PropTypes.object,
};

App.propTypes = {
    uploadRequest: PropTypes.func.isRequired,
    clearStore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.object,
};
