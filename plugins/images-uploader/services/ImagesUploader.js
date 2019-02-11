
const fs = require('fs');
const request = require('request');
const gm = require('gm').subClass({ imageMagick: true });

module.exports = {
    upload: async (files, size, host, authorization) => {
        const filesArray = Array.isArray(files) ? files : [files];

        return Promise.all(
            filesArray.map(async (file) => {
                const name = `${file.path}${file.name.replace(/^[^.]+\.(.+)$/, '.$1')}`;

                await strapi.plugins['images-uploader'].services.imagesuploader.resize(file.path, name, size);
                const uploadedImage = await strapi.plugins['images-uploader'].services.imagesuploader.add(
                    host,
                    authorization,
                    name
                );

                return uploadedImage;
            })
        );
    },

    resize: async (fPath, fName, size) => (
        new Promise((resolve, reject) => {
            gm(fPath)
                .resize(size, size, '^')
                .gravity('Center')
                .crop(size, size, 0, 0)
                .noProfile()
                .write(fName, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    gm(fName).filesize((getSizeErr, imageDiskSize) => {
                        if (getSizeErr) {
                            reject(getSizeErr);
                            return;
                        }
                        resolve(imageDiskSize);
                    });
                });
        })
    ),

    add: async (host, authorization, file) => (
        new Promise((resolve, reject) => {
            request.post({
                url: `http://${host}/upload`,
                headers: {
                    authorization,
                },
                formData: {
                    files: fs.createReadStream(file),
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(JSON.parse(body)[0]);
            });
        })
    ),
};
