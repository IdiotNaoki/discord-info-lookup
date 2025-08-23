const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const guildCache = new NodeCache({ stdTTL: 3600 });

module.exports = getGuild = async (guildId) => {
  var typeCheck = typeof guildId !== "string";
  var formatCheck = !/^\d+$/.test(guildId);

  Promise.all(
    [typeCheck, formatCheck].map((check, i) => {
      if (check) {
        const messages = [
          `A string is expected, but a ${typeof guildId} is given.`,
          `Numbers were expected, but "${guildId}" contains non-numbers.`,
        ];
        throw new Error(messages[i]);
      }
    })
  );

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
