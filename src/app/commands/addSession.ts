import { ChatInputCommand, CommandData } from "commandkit";
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  InteractionContextType,
} from "discord.js";
import * as fs from "node:fs/promises";

export const command: CommandData = {
  name: "session-add",
  description: "Set a new session object",
  integration_types: [ApplicationIntegrationType.UserInstall],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
    InteractionContextType.Guild,
  ],
  options: [
    {
      name: "json",
      description: "JSON object from QIMS",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const jsonFileContent = JSON.parse(
    await fs.readFile("sessionInfo.json", { encoding: "utf-8" }),
  );
  const interaction = ctx.interaction;
  const commandOptions = {
    json: JSON.parse(interaction.options.getString("json", true)),
  };
  jsonFileContent[
    parseInt(commandOptions.json.session.timestamp.replace("<t:", ""))
  ] = commandOptions.json;
  await fs.writeFile(
    "sessionInfo.json",
    JSON.stringify(jsonFileContent, null, 2),
  );

  await interaction.reply({
    content: `Added practice session ${commandOptions.json.session.timestamp} with trainees: ${commandOptions.json.trainees.usernames.join(", ")}`,
    flags: "Ephemeral",
  });
  return;
};
