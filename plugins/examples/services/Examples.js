
const fs = require('fs');
const request = require('request');

module.exports = {
    get: async (host, authorization, file, croppedFilePath, genre) => (
        new Promise((resolve, reject) => {
            request.post({
                url: `http://${host}/upload`,
                headers: {
                    authorization,
                },
                formData: {
                    files: fs.createReadStream(croppedFilePath),
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(JSON.parse(body)[0]);
                fs.unlinkSync(file.path);
                fs.unlinkSync(croppedFilePath);
            });
        }).then(fileUploadResult => (
            new Promise((resolve, reject) => {
                request.post({
                    url: `http://${host}/content-manager/explorer/image`,
                    headers: {
                        authorization,
                    },
                    formData: {
                        url: `/uploads/${fileUploadResult.hash}${fileUploadResult.ext}`,
                        genre,
                    },
                }, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(fileUploadResult);
                });
            })
        ))
    ),
};
