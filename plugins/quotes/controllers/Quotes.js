module.exports = {
    index: async (ctx) => {
        // Add your own logic here.

        // Send 200 `ok`
        ctx.send({
            message: 'ok',
        });
    },
};
