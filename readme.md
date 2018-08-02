
1.  In the command line, run the following command to start the server:

- $ `git clone git@github.com:saturninoabril/hapi-server.git` or `git clone https://github.com/saturninoabril/hapi-server`
- $ `cd hapi-server`
- $ `npm install`
- $ `node server.js` - default response is without username and icon_url.

    :: If wanted to set the username in the response, run the server like `WITH_USERNAME=true node server.js`
    
    :: If wanted to set the icon_url in the response, run the server like `WITH_ICON_URL=true node server.js`
    
    :: If wanted to set both username and icon_url in the response, run the server like `WITH_ICON_URL=true WITH_USERNAME=true node server.js`

    :: Server has started successfully when the console printed `Server running at: http://localhost:3000`

2.  (Optional) Setup a tunnel so your local `hapi-server` instance can be accessed outside your local network
- download `ngrok` and follow its setup instruction at https://ngrok.com/download
- run at the command line: $ `./ngrok http 3000`
- take note of the forwarding URL (e.g. `http://ad3cc10f.ngrok.io`)

3.  Setup outgoing webhook of Mattermost server, following the documentation:
- https://docs.mattermost.com/developer/webhooks-outgoing.html#create-an-outgoing-webhook

    ::  `Callback URLs` can be set to anything, like:
    - `http://localhost:3000/hook`, `http://localhost:3000/anotherhook`, 
    - `http://ad3cc10f.ngrok.io/hook`, `http://ad3cc10f.ngrok.io/anotherhook`, 
    - etc.

4. Verify that the incoming payload & headers are received by the hapi-server from Mattermost server.
- observe the payload being printed in console for every hook.
- verify the payload you're expecting to receive.

    :: Sample incoming payload:
```
{ 
    token: 'y41bbi8p5bfbmgioiajeyx4g7e',
    team_id: 'syukb1muop8xuei5k8r66ted5o',
    team_domain: 'ad-1',
    channel_id: 'y19oxu5h17r1x8fnu7cm4zkq3w',
    channel_name: 'outgoing',
    timestamp: 1533212631376,
    user_id: 'jr5bqb3izj8u3r7tu81oti1g8h',
    user_name: 'user-1',
    post_id: 'f3wii843hpg5brai8jdcp9rwza',
    text: 'another',
    trigger_word: 'another',
    file_ids: ''
}
```

    :: Sample incoming headers:
```
{ 
    host: 'ad3cc10f.ngrok.io',
    'user-agent': 'Go-http-client/1.1',
    'content-length': '347',
    accept: 'application/json',
    'content-type': 'application/json',
    'accept-encoding': 'gzip',
    'x-forwarded-for': '54.188.242.58' 
}
```

5. Verify the outgoing response from hapi-server to Mattermost server.
- observe the outgoing response being printed in console for every hook.

    :: Sample outgoing response:
```
{ 
    text: '#### Outgoing Webhook Response\n - token: "y41bbi8p5bfbmgioiajeyx4g7e"\n - trigger_word: "another"\n - text: "another"\n - channel_name: "outgoing"\n - team_domain: "ad-1"\n',
    username: '',
    icon_url: 'https://docs.mattermost.com/_images/icon-76x76.png',
    type: '',
    response_type: 'in_channel' 
}
```

