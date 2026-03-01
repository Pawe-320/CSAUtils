import {
  AutocompleteCommand,
  ChatInputCommand,
  CommandData,
  Label,
  Logger,
  Modal,
  UserSelectMenu,
} from "commandkit";
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  InteractionContextType,
} from "discord.js";
import zoneModalHandler from "../modals/manageDriversModal";
import * as fs from "node:fs/promises";
import ISessionData from "@/types/ISessionData";

export const command: CommandData = {
  name: "manage-drivers",
  description: "Manage drivers during a practice session",
  integration_types: [ApplicationIntegrationType.UserInstall],
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "session-trainee",
      description: "Session time and the trainee that you want to select",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
    },
  ],
};

export const autocomplete: AutocompleteCommand = async ({ interaction }) => {
  try {
    const rawData = await fs.readFile("sessionInfo.json", "utf-8");
    const jsonData: ISessionData = JSON.parse(rawData);

    const choices: { name: string; value: string }[] = [];

    // 1. Use Object.entries to iterate over the JSON object
    for (const [key, sessionData] of Object.entries(jsonData)) {
      const gmtTime = new Date(parseInt(key) * 1000);

      const day = gmtTime.getUTCDate(); // e.g., 28
      const month = gmtTime.getUTCMonth() + 1; // Months are 0-indexed
      const hours = gmtTime.getUTCHours().toString().padStart(2, "0");
      const minutes = gmtTime.getUTCMinutes().toString().padStart(2, "0");

      const timeString = `${day}/${month} ${hours}:${minutes} GMT`;

      // 2. Loop through each trainee in this specific session
      sessionData.trainees.usernames.forEach(
        (username: string, index: number) => {
          const displayName = `${timeString} - ${username} // Zone ${sessionData.trainees.zone[index]} // ${sessionData.trainees.trains[index]} Trains // ${sessionData.trainees.lf[index] ? "LF" : "No LF"}`;

          choices.push({
            name: displayName,
            // Storing session key and trainee index so you know who to target later
            value: `${key}-${index}`,
          });
        },
      );
    }

    // 3. Filter based on what the user is typing (Search functionality)
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = choices
      .filter((choice) => choice.name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

    await interaction.respond(filtered);
  } catch (error) {
    console.error("Autocomplete Error:", error);
    await interaction.respond([]); // Always respond, even if empty, to avoid console spam
  }
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;
  const commandOptions = {
    session: interaction.options
      .getString("session-trainee")
      ?.split("-")[0] as string,
    trainee: interaction.options
      .getString("session-trainee")
      ?.split("-")[1] as string,
  };

  const rawData = await fs.readFile("sessionInfo.json", "utf-8");
  const jsonData = JSON.parse(rawData);

  const getDefaultdrivers = async (): Promise<string[]> => {
    if (!commandOptions.session) return [];
    const defaultDrivers = [];

    const trainee =
      jsonData[commandOptions.session].trainees.ids[commandOptions.trainee];
    const drivers = jsonData[commandOptions.session]?.drivers?.ids ?? [];
    defaultDrivers.push(...drivers);
    defaultDrivers.push(
      ...jsonData[commandOptions.session].trainees.ids.filter(
        (e: string) => e != trainee,
      ),
    );
    return defaultDrivers.slice(
      0,
      jsonData[commandOptions.session].trainees.trains[
        commandOptions.trainee
      ] === "Max"
        ? 99
        : jsonData[commandOptions.session].trainees[commandOptions.trainee],
    );
  };

  const modal = (
    <Modal
      customId={`zoneModal-${commandOptions.session}-${commandOptions.trainee}`}
      title="Driver Selection Menu"
      onSubmit={zoneModalHandler}
    >
      <Label label="Check if the trainee below is correct">
        <UserSelectMenu
          customId="trainee"
          minValues={1}
          maxValues={1}
          defaultValues={[
            jsonData[commandOptions.session].trainees.ids[
              String(commandOptions.trainee)
            ],
          ]}
        />
      </Label>
      <Label
        label="Select the drivers for this trainee"
        description="Not required if trainee requested max trains"
      >
        <UserSelectMenu
          customId="drivers"
          maxValues={15}
          defaultValues={(await getDefaultdrivers()) ?? []}
        />
      </Label>
    </Modal>
  );
  await interaction.showModal(modal);
  return;
};
