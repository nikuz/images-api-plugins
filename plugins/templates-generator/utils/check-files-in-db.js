
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const getAll = (folder, accumulator) => {
    const files = fs.readdirSync(folder);
    const reg = /\.jpe?g|gif|mp4$/;
    let stat;
    let folderPart = folder;

    if (!/\/$/.test(folderPart)) {
        folderPart += '/';
    }

    for (let i = 0, l = files.length; i < l; i++) {
        const filePath = folderPart + files[i];
        stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAll(`${filePath}/`, accumulator);
        } else if (reg.test(filePath)) {
            accumulator.push(filePath);
        }
    }

    return accumulator;
};

if (!global.strapi) {
    mongo.connect(url, async (err, client) => {
        if (err) {
            console.error(err); // eslint-disable-line
            return;
        }
        const db = client.db('images-api');
        const collection = db.collection('templates');

        const publicFiles = getAll(path.resolve(__dirname, '../../../public/uploads'), []);

        if (publicFiles.length) {
            let i = 0;
            publicFiles.forEach(async (item) => {
                const file = item.replace(/^.+(\/uploads\/.+$)/, '$1');
                const res = await collection.find({ image: file });
                const ar = await res.toArray();
                if (!ar.length) {
                    console.log('Remove file:', item); // eslint-disable-line
                    fs.unlinkSync(item);
                }
                if (i === publicFiles.length - 1) {
                    client.close();
                    process.exit(1);
                }
                i++;
            });
        } else {
            client.close();
            process.exit(1);
        }
    });
}
