
module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    preview: async (ctx) => {
        const { file = {} } = ctx.request.body.files;

        const preview = await strapi.plugins['templates-generator'].services.templatesgenerator.getPreview(
            file,
            ctx.request.body.fields
        );

        if (preview.code !== 200) {
            ctx.response.serverUnavailable(preview.body);
        } else {
            ctx.send({
                image: preview.body,
            });
        }
    },

    save: async (ctx) => {
        const { file = {} } = ctx.request.body.files;

        const newTemplate = await strapi.plugins['templates-generator'].services.templatesgenerator.save(
            file,
            ctx.request.body.fields,
            ctx.request.header.host,
            ctx.request.header.authorization
        );

        ctx.send(newTemplate);
    },
};
