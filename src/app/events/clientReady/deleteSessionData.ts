import * as fs from "node:fs/promises";
import { Logger } from "commandkit";

const SESSION_PATH = "sessionInfo.json";
const hoursBeforeDelete = 3 * 60 * 60 * 1000;

export default async function cleanupOldSessions() {
  try {
    const data = await fs.readFile(SESSION_PATH, "utf-8");
    const sessions = JSON.parse(data);
    const now = Date.now();
    let changed = false;

    for (const key in sessions) {
      const sessionTimeMs = parseInt(key) * 1000;

      if (now - sessionTimeMs > hoursBeforeDelete) {
        delete sessions[key];
        changed = true;
        Logger.info(`Cleaned up expired session: ${key}`);
      }
    }

    if (changed) {
      await fs.writeFile(SESSION_PATH, JSON.stringify(sessions, null, 2));
    }
  } catch (err) {
    Logger.error(["Error during session cleanup:\n", err]);
  }
}

setInterval(cleanupOldSessions, 60_000);
