import { OnModalKitSubmit } from "commandkit";
import { EmbedBuilder, GuildMember } from "discord.js";
import zoneInfo from "../../config/zoneInfo.json";
import * as fs from "node:fs/promises";
import ISessionData from "@/types/ISessionData";

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

  const [, sessionKey, traineeIdxStr] = ctx.customId.split("-");
  const traineeIndex = parseInt(traineeIdxStr as string);

  const currentSession = jsonData[sessionKey as string];

  const zone = currentSession.trainees.zone[
    traineeIndex
  ] as keyof typeof zoneInfo;
  const traineeUser = ctx.fields.getSelectedUsers("trainee", true)?.first();
  const drivers = ctx.fields.getSelectedUsers("drivers", true);

  if (!traineeUser) return;

  const driversPing = drivers?.map((e) => `<@${e.id}>`) || [];
  const neededTrains = currentSession.trainees.trains[traineeIndex];

  // Logic for the message content
  let content = "";
  if (neededTrains === "Max") {
    content = "# Can Everyone Please drive...";
  } else {
    const pingString = driversPing.join(", ");
    const countCheck =
      driversPing.length >= Number(neededTrains)
        ? ""
        : `(${neededTrains} needed total)`;
    content = `Drivers: ${pingString} ${countCheck}\nPlease drive in Zone ${zone}`;
  }

  // ... send reply
};

export default zoneModalHandler;
