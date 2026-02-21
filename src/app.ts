import { Client } from "discord.js";

const client = new Client({
  intents: ["Guilds", "DirectMessages"],
});

export default client;
