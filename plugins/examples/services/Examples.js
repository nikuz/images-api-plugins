
const request = require('request');

module.exports = {
    get: async props => (
        new Promise((resolve, reject) => {
            request.post({
                url: 'http://localhost:5790/',
                formData: {
                    ...props,
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
