
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

        const randomImage = await Image // eslint-disable-line
            .aggregate([
                { $match: { genre: mongoose.Types.ObjectId(fields.genre) } },
                { $sample: { size: 1 } },
            ]);

        const randomQuote = await Quotes // eslint-disable-line
            .aggregate([
                { $match: { genre: mongoose.Types.ObjectId(fields.genre) } },
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

        const width = Number(fields.width);
        const height = Number(fields.height);
        const props = {
            ...ctx.request.body.fields,
            imageURL: `${apiUrl}${randomImage[0].url}`,
            text: randomQuote[0].text,
            author: randomQuote[0].author,
            width: width < 1080 ? width : 500,
            height: height < 1080 ? height : 500,
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
