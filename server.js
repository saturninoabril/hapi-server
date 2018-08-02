'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: ['PUT', 'POST'],
    path: '/{hook}',
    handler: (request, h) => {
        const hook = request.params.hook ?
            encodeURIComponent(request.params.hook) :
            'hook';
        console.log(`Payload on /${hook}:`);
        console.log(request.payload);
        console.log(`Header on /${hook}:`);
        console.log(request.headers);
        return `Processing the hook on /${hook}`;
    }
});

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
