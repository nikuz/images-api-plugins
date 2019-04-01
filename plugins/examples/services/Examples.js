
const fs = require('fs');
const request = require('request');

module.exports = {
    get: async (logo, props) => {
        const formData = {
            ...props,
        };
        if (logo) {
            formData.logo = fs.createReadStream(logo.path);
        }

        Object.keys(formData).forEach((key) => {
            formData[key] = String(formData[key]);
        });

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
