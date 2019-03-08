
module.exports = {
    index: async (ctx) => {
        ctx.send({
            message: 'ok',
        });
    },

    upload: async (ctx) => {
        const { file = {} } = ctx.request.body.files;
        const {
            size,
            genre,
        } = ctx.request.body.fields;

        const uploadedFiles = await strapi.plugins['images-uploader'].services.imagesuploader.upload(
            file,
            size,
            genre,
            ctx.request.header.host,
            ctx.request.header.authorization
        );

        ctx.send(uploadedFiles);
    },
};
