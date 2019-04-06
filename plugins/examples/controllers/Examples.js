
const mongoose = require('mongoose');

module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    get: async (ctx) => {
        const { logo } = ctx.request.body.files;
        const fields = ctx.request.body.fields;

        if (!fields.genre) {
            ctx.response.serverUnavailable('define genre');
            return;
        }

        if (!fields.templates) {
            ctx.response.serverUnavailable('define templates');
            return;
        }

        let genreMongoObject;
        try {
            genreMongoObject = mongoose.Types.ObjectId(fields.genre);
        } catch (e) {
            ctx.response.serverUnavailable('wrong genre');
            return;
        }

        const templates = fields.templates.split(',');

        const randomImage = await Image // eslint-disable-line
            .aggregate([
                { $match: { genre: genreMongoObject } },
                { $sample: { size: 1 } },
            ]);

        const randomQuote = await Quotes // eslint-disable-line
            .aggregate([
                { $match: { genre: genreMongoObject } },
                { $sample: { size: 1 } },
            ]);

        const randomTemplate = await Templates // eslint-disable-line
            .aggregate([
                { $match: { id: { $in: templates } } },
                { $sample: { size: 1 } },
            ]);

        const apiUrl = await strapi.config.url;

        if (!randomImage || !randomImage[0]) {
            ctx.response.serverUnavailable('no random image');
            return;
        }

        if (!randomQuote || !randomQuote[0]) {
            ctx.response.serverUnavailable('no random quote');
            return;
        }

        if (!randomTemplate || !randomTemplate[0]) {
            ctx.response.serverUnavailable('no random template');
            return;
        }

        let width = 500;
        let height = 500;
        if (randomTemplate[0].crop === 1024) {
            width = 500;
            height = width / 2;
        }
        const props = {
            ...randomTemplate[0],
            animate: randomTemplate[0].format !== 'jpeg',
            imageURL: `${apiUrl}${randomImage[0].url}`,
            text: randomQuote[0].text,
            author: randomQuote[0].author,
            width,
            height,
            watermark: true,
        };
        delete props.image;

        const example = await strapi.plugins.examples.services.examples.get(
            logo,
            props
        );

        if (example.code !== 200) {
            ctx.response.serverUnavailable(example.body);
        } else {
            ctx.send({
                example: example.body,
            });
        }
    },
};
