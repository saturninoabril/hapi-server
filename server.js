'use strict';

const Hapi = require('hapi');

const WITH_USERNAME = process.env.WITH_USERNAME;
const WITH_ICON_URL = process.env.WITH_ICON_URL;

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const responseTypes = [
    'in_channel',
    'ephemeral',
];

const postTypes = [
    '',
    'slack_attachment',
    'system_generic',
];

server.route({
    method: ['PUT', 'POST'],
    path: '/{hook}',
    handler: (request, h) => {
        const hook = request.params.hook ?
            encodeURIComponent(request.params.hook) :
            'hook';
        const {payload} = request;
        console.log(`\nIncoming payload on /${hook}:`);
        console.log(payload);
        console.log(`\nIncoming header on /${hook}:`);
        console.log(request.headers);

        const defaultPostType = postTypes[0];
        const defaultResponseType = responseTypes[0];

        const text = `#### Outgoing Webhook Response\n - token: "${payload.token}"\n - trigger_word: "${payload.trigger_word}"\n - text: "${payload.text}"\n - channel_name: "${payload.channel_name}"\n - team_domain: "${payload.team_domain}"\n`;
        const username = WITH_USERNAME ? `${payload.user_name}` : '';
        const iconUrl = WITH_ICON_URL ? 'https://docs.mattermost.com/_images/icon-76x76.png' : '';
        const outGoingResponse = {
            text,
            username,
            icon_url: iconUrl,
            type: defaultPostType,
            response_type: defaultResponseType
        };

        console.log('\nOutgoing response: ');
        console.log(outGoingResponse);

        return outGoingResponse;
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
