"use strict";

const Hapi = require("@hapi/hapi");

const WITH_USERNAME = process.env.WITH_USERNAME;
const WITH_ICON_URL = process.env.WITH_ICON_URL;

const responseTypes = ["in_channel", "ephemeral"];

const postTypes = ["", "slack_attachment", "system_generic"];

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route([
    {
      method: "GET",
      path: "/ping",
      handler: (request, h) => {
        return "pong!";
      },
    },
    {
      method: ["PUT", "POST"],
      path: "/{hook}",
      handler: (request, h) => {
        const hook = request.params.hook
          ? encodeURIComponent(request.params.hook)
          : "hook";
        const { payload } = request;
        console.log(`\nIncoming payload on /${hook}:`);
        console.log(payload);
        console.log(`\nIncoming header on /${hook}:`);
        console.log(request.headers);

        if (!payload) {
            return h.response("No payload found").code(400);
        }

        const defaultPostType = postTypes[0];
        const defaultResponseType = responseTypes[0];

        const text = `#### Outgoing Webhook Response\n ${Object.entries(payload).map(([key, value]) => `- ${key}: "${value}"`).join("\n")}`;
        const username = WITH_USERNAME ? `${payload.user_name}` : "";
        const iconUrl = WITH_ICON_URL
          ? "https://docs.mattermost.com/_images/icon-76x76.png"
          : "";
        const outGoingResponse = {
          text,
          username,
          icon_url: iconUrl,
          type: defaultPostType,
          response_type: defaultResponseType,
        };

        console.log("\nOutgoing response: ");
        console.log(outGoingResponse);

        return outGoingResponse;
      },
    },
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
