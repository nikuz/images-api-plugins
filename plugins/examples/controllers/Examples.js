
module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    get: async (ctx) => {
        const {
            size,
            genre,
        } = ctx.request.body.fields;

        const example = await strapi.plugins.examples.services.examples.get(
            size,
            genre,
            ctx.request.header.host,
            ctx.request.header.authorization
        );

        ctx.send(example);
    },
};
