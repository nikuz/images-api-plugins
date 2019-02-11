
module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    upload: async (ctx) => {
        const { files = {} } = ctx.request.body.files;
        const { size } = ctx.request.body.fields;

        const uploadedFiles = await strapi.plugins['images-uploader'].services.imagesuploader.upload(
            files,
            size,
            ctx.request.header.host,
            ctx.request.header.authorization
        );

        ctx.send(uploadedFiles);
    },
};
