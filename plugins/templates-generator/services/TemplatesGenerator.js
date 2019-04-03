
const fs = require('fs');
const request = require('request');

module.exports = {
    getPreview: (image, fields) => {
        const formData = {
            ...fields,
        };
        if (image) {
            formData.image = fs.createReadStream(image.path);
        }
        return new Promise((resolve, reject) => {
            request.post({
                url: 'http://localhost:5790/',
                formData,
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
        });
    },
};
