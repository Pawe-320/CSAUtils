import { ChatInputCommand, CommandData } from "commandkit";
import zoneInfo from "../../config/zoneInfo.json";
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";

const zoneNumbers = Object.keys(zoneInfo).map((e) => {
  return { name: e, value: e };
});
const zoneMapImg =
  "https://cdn.discordapp.com/attachments/1474746827881578628/1474761657229246637/SCR_2.3_Signalling_Zone_Map.webp?ex=699b0652&is=6999b4d2&hm=12714cfadb7d50c947a75fa75b0831698f42694a88f49fe7615d8ceec27de2fe&";
export const command: CommandData = {
  name: "zone",
  description: "Post a message containing zone info for signalling levels",
  integration_types: [ApplicationIntegrationType.UserInstall],
  contexts: [
    InteractionContextType.PrivateChannel,
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
  ],
  options: [
    {
      name: "zone",
      description: "The zone you want to select",
      type: ApplicationCommandOptionType.String,
      choices: zoneNumbers,
      required: true,
    },
    {
      name: "level",
      description: "The level you want to get information about",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "L1", value: "l1" },
        { name: "L2", value: "l2" },
        { name: "L3", value: "l3" },
        { name: "L4", value: "l4" },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;
  const commandOptions = {
    zone: interaction.options.getString("zone", true) as keyof typeof zoneInfo,
    level: interaction.options.getString("level"),
  };

  const embed = new EmbedBuilder()
    .setImage(zoneMapImg)
    .setColor("Aqua")
    .setTitle(
      `${commandOptions?.level ? `${commandOptions?.level?.toUpperCase()}${parseInt(commandOptions?.level?.slice(1)) > 2 ? " Assesment |" : " Practical |"}` : ""} Zone ${commandOptions.zone}`,
    )
    .setDescription(
      `## Zone Information:\n**Desk:** ${zoneInfo[commandOptions.zone].location}\n**Signal Prefix:** __${zoneInfo[commandOptions.zone].prefix}__\n**Stations:**\n${zoneInfo[commandOptions.zone].stations}`,
    );

  await interaction.reply({
    embeds: [embed],
  });
  return;
};
