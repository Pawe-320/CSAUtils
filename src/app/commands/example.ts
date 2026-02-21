import type { ChatInputCommand, CommandData, MessageCommand } from "commandkit";
import { ApplicationIntegrationType, InteractionContextType } from "discord.js";

export const command: CommandData = {
  name: "ping",
  description: "Pong!",
  integration_types: [ApplicationIntegrationType.UserInstall],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  ],
};

export const chatInput: ChatInputCommand = async ({ interaction }) => {
  await interaction.reply("Pong!");
};

export const message: MessageCommand = async ({ message }) => {
  await message.reply("Pong!");
};
