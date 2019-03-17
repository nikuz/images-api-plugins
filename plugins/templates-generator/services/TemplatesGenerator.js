
const fs = require('fs');
const request = require('request');

module.exports = {
    getPreview: (image, fields) => (
        new Promise((resolve, reject) => {
            request.post({
                url: 'http://localhost:5679/',
                formData: {
                    image: fs.createReadStream(image.path),
                    ...fields,
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    code: httpResponse.statusCode,
                    body,
                });
            });
        })
    ),

    save: (image, fields, host, authorization) => {
        const imagePath = `${image.path}.${fields.format}`;
        fs.copyFileSync(image.path, imagePath);

        return new Promise((resolve, reject) => {
            request.post({
                url: `http://${host}/upload`,
                headers: {
                    authorization,
                },
                formData: {
                    files: fs.createReadStream(imagePath),
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(JSON.parse(body)[0]);
                fs.unlinkSync(image.path);
                fs.unlinkSync(imagePath);
            });
        }).then(fileUploadResult => (
            new Promise((resolve, reject) => {
                request.post({
                    url: `http://${host}/content-manager/explorer/templates`,
                    headers: {
                        authorization,
                    },
                    formData: {
                        ...fields,
                        image: fileUploadResult.url.replace(`http://${host}`, ''),
                        fileId: fileUploadResult.id,
                        system: 'true',
                    },
                }, (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(body);
                });
            })
        ));
    },
};
