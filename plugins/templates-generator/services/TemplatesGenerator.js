
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
};
