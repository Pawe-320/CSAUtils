import { ChatInputCommand, CommandData } from "commandkit";
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  InteractionContextType,
} from "discord.js";
import * as fs from "node:fs/promises";
import roles from "src/config/roles.json";

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
  const interaction = ctx.interaction;
  if (!interaction.member) return;

  const roleIds = Array.isArray(interaction.member.roles)
    ? interaction.member.roles
    : interaction.member.roles.cache.map((r) => r.id);
  const allowedRoles = [roles.TAS, roles.JTR, roles.QTR];
  const hasRole = allowedRoles.some((r) => roleIds.includes(r));
  if (!hasRole)
    return await interaction.reply({
      content: ":x: You don't have enough permissions to run this command",
      flags: "Ephemeral",
    });

  const jsonFileContent = JSON.parse(
    await fs.readFile("sessionInfo.json", { encoding: "utf-8" }),
  );
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
