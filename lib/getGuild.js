const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const guildCache = new NodeCache({ stdTTL: 3600 });

module.exports = getGuild = async (guildId) => {
  switch (true) {
    case typeof userId !== "string":
      throw new Error(
        `A string is expected, but a ${typeof userId} is given.`
      );

    case !/^\d+$/.test(userId):
      throw new Error(
        `Numbers were expected, but "${userId}" contains non-numbers.`
      );
  }

  try {
    const cachedGuild = guildCache.get(guildId);
    switch (cachedGuild) {
      case undefined:
        break;
      default:
        return cachedGuild;
    }

    const response = await fetch(
      `https://canary.discord.com/api/v10/guilds/${guildId}/widget.json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (json.code && json.code === 50004) {
      throw new Error(
        `The guild ${guildId} does not exist, is unavailable or has Server Widget/Discovery disabled.`
      );
    }

    let output = {
      id: json.id,
      name: json.name,
      instant_invite: json.instant_invite,
      presence_count: json.presence_count,
    };

    guildCache.set(guildId, output);
  } catch (err) {
    console.log(err);
  }

  const value = await guildCache.get(guildId);
  if (value == undefined) return;
  return value;
};
