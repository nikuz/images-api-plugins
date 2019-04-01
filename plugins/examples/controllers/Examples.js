
const querystring = require('querystring');

module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    get: async (ctx) => {
        const randomImage = await Image.aggregate([{ $sample: { size: 1 } }]); // eslint-disable-line
        const randomQuote = await Quotes.aggregate([{ $sample: { size: 1 } }]); // eslint-disable-line
        const configuratorProps = querystring.decode(ctx.request.querystring);
        const apiUrl = await strapi.config.url;

        if (!randomImage || !randomImage[0]) {
            ctx.response.serverUnavailable('no random image');
            return;
        }

        if (!randomQuote || !randomQuote[0]) {
            ctx.response.serverUnavailable('no random quote');
            return;
        }

        const props = {
            ...configuratorProps,
            imageURL: `${apiUrl}${randomImage[0].url}`,
            text: randomQuote[0].text,
            author: randomQuote[0].author,
        };
        delete props.image;
        delete props.genre;

        const example = await strapi.plugins.examples.services.examples.get(props);

        if (example.code !== 200) {
            ctx.response.serverUnavailable(example.body);
        } else {
            ctx.send({
                example: example.body,
            });
        }
    },
};
