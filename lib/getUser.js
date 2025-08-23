const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const { USER_FLAGS } = require("../funcs/Constants");
const { snowflakeToDate } = require("../funcs/snowflakeToDate");
const { timeConverter } = require("../funcs/timeConverter");

const userCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

module.exports = getUser = async (userId) => {
  var typeCheck = typeof userId !== "string";
  var formatCheck = !/^\d+$/.test(userId);

  Promise.all(
    [typeCheck, formatCheck].map((check, i) => {
      if (check) {
        const messages = [
          `A string is expected, but a ${typeof userId} is given.`,
          `A number is expected, but "${userId}" contains non-numbers.`,
        ];
        throw new Error(messages[i]);
      }
    })
  );

  try {
    const cachedUser = userCache.get(userId);
    switch (cachedUser) {
      case undefined:
        break;
      default:
        return cachedUser;
    }

    const response = await fetch(
      `https://canary.discord.com/api/v10/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${process.env.TOKEN}`,
        },
      }
    );

    const json = await response.json();

    if (json.code && json.code === 10013) {
      throw new Error(`The user ${userId} does not exist or is unavailable.`);
    }

    let publicFlags = [];

    let premiumTypes = {
      0: "None",
      1: "Nitro Classic",
      2: "Nitro",
      3: "Nitro Basic",
    };

    USER_FLAGS.forEach((flag) => {
      if (json.public_flags & flag.bitwise) publicFlags.push(flag.flag);
    });

    let avatarLink = json.avatar
      ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=480`
      : null;
    let bannerLink = json.banner
      ? `https://cdn.discordapp.com/banners/${json.id}/${json.banner}?size=480`
      : null;

    let output = {
      id: json.id,
      username: json.username,
      created_at: timeConverter(snowflakeToDate(json.id)),
      avatar: {
        id: json.avatar,
        link: avatarLink,
        is_animated:
          json.avatar != null && json.avatar.startsWith("a_") ? true : false,
      },
      avatar_decoration: json.avatar_decoration_data,
      badges: publicFlags,
      premium_type: premiumTypes[json.premium_type],
      accent_color: json.accent_color,
      global_name: json.global_name,
      banner: {
        id: json.banner,
        link: bannerLink,
        is_animated:
          json.banner != null && json.banner.startsWith("a_") ? true : false,
        color: json.banner_color,
      },
      clan: json.clan ? json.clan : null,
      raw: json,
    };

    userCache.set(userId, output);
  } catch (err) {
    throw err;
  }

  const value = userCache.get(userId);
  if (value == undefined) return;
  return value;
};
