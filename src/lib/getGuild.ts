import NodeCache from "node-cache";

const guildCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export interface DiscordGuildOutput {
  id: string;
  name: string;
  instant_invite?: string | null;
  presence_count?: number;
}

export const getGuild = async (
  guildId: string
): Promise<DiscordGuildOutput | undefined> => {
  if (typeof guildId !== "string") {
    throw new Error(`A string is expected, but got ${typeof guildId}`);
  }
  if (!/^\d+$/.test(guildId)) {
    throw new Error(
      `Numbers were expected, but "${guildId}" contains non-numbers.`
    );
  }

  const cachedGuild = guildCache.get<DiscordGuildOutput>(guildId);
  if (cachedGuild) return cachedGuild;

  try {
    const response = await fetch(
      `https://canary.discord.com/api/v10/guilds/${guildId}/widget.json`,
      { headers: { "Content-Type": "application/json" } }
    );

    const json: any = await response.json();

    if (json.code === 50004) {
      throw new Error(
        `The guild ${guildId} does not exist, is unavailable, or has Server Widget/Discovery disabled.`
      );
    }

    const output: DiscordGuildOutput = {
      id: json.id,
      name: json.name,
      instant_invite: json.instant_invite ?? null,
      presence_count: json.presence_count ?? 0,
    };

    guildCache.set(guildId, output);
    return output;
  } catch (err) {
    console.error(`Error fetching guild ${guildId}:`, err);
    return undefined;
  }
};
