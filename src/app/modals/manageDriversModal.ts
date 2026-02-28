import { OnModalKitSubmit } from "commandkit";
import { EmbedBuilder, GuildMember } from "discord.js";
import zoneInfo from "../../config/zoneInfo.json";
import * as fs from "node:fs/promises";

const zoneMapImg =
  "https://cdn.discordapp.com/attachments/1474746827881578628/1474761657229246637/SCR_2.3_Signalling_Zone_Map.webp?ex=699b0652&is=6999b4d2&hm=12714cfadb7d50c947a75fa75b0831698f42694a88f49fe7615d8ceec27de2fe&";
interface fuckTypescript extends GuildMember {
  nick: string;
}
export const levelTimeMap: Record<
  string,
  { setup: string; signalling: string; trains: number | string }
> = {
  l1: {
    setup: "2 min",
    signalling: "5 min",
    trains: 3,
  },
  l2: {
    setup: "3 min",
    signalling: "6 min",
    trains: 4,
  },
  l3: {
    setup: "2 min",
    signalling: "8 min",
    trains: 5,
  },
  l4: {
    setup: "2 min",
    signalling: "10 min",
    trains: "6+",
  },
};
const zoneModalHandler: OnModalKitSubmit = async (ctx) => {
  const rawData = await fs.readFile("sessionInfo.json", "utf-8");
  const jsonData = JSON.parse(rawData);
  const options = {
    traineeIndex: ctx.customId.split("-")[2] as string,
    zone: ctx.customId.split("-")[1] as keyof typeof zoneInfo,
    trainee: ctx.fields.getSelectedMembers("trainee")?.first() as
      | fuckTypescript
      | undefined,
    traineeUser: ctx.fields.getSelectedUsers("trainee")?.first(),
    drivers: ctx.fields.getSelectedUsers("drivers"),
  };

  if (!options.trainee || !options.traineeUser) return;
  const driversPing = options.drivers?.map((e) => `<@${e.id}>`);
  const embed = new EmbedBuilder()
    .setImage(zoneMapImg)
    .setColor("Aqua")
    .setTitle(`Zone ${options.zone}`)
    .setDescription(`### Current Turn Information:\n**Trainee:** <@${options.traineeUser.id}>
### Zone Information\n**Desk:** ${zoneInfo[options.zone].location}\n**Signal Prefix:** __${zoneInfo[options.zone].prefix}__\n**Stations:**\n${zoneInfo[options.zone].stations}`);

  await ctx.reply({
    content: `${jsonData.trainees.trains[options.traineeIndex] == "Max" ? "Can Everyone" : `Drivers: ${driversPing?.join(", ")}`}\n"Please drive in Zone ${options.zone} for ${options.trainee.nick}`,
    embeds: [embed],
  });
};

export default zoneModalHandler;
