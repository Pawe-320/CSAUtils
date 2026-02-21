import { EventHandler, Logger } from "commandkit";

const consoleLogReady: EventHandler<"clientReady"> = (client) => {
  Logger.info(`Logged in as ${client.user.username}!`);
};

export default consoleLogReady;
