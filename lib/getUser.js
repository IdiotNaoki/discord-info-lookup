const axios = require("axios");
const NodeCache = require("node-cache");
const moment = require('moment');

const { USER_FLAGS } = require('../funcs/Constants');
const { snowflakeToDate } = require('../funcs/snowflakeToDate');

const userCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const getUser = async (userId) => {

    const cachedUser = userCache.get(userId);
    if (cachedUser == undefined) return;
    if (cachedUser) return cachedUser;

    await axios(`https://canary.discord.com/api/v10/users/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.TOKEN}`,
        }
    })
        .then((res) => res.data)
        .then(async (json) => {

            let publicFlags = [];

            let premiumTypes = {
                0: "None",
                1: "Nitro Classic",
                2: "Nitro",
                3: "Nitro Basic"
            }

            USER_FLAGS.forEach((flag) => {
                if (json.public_flags & flag.bitwise) publicFlags.push(flag.flag);
            });

            let avatarLink = json.avatar ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=480` : null;

            let bannerLink = json.banner ? `https://cdn.discordapp.com/banners/${json.id}/${json.banner}?size=480` : null;

            let output = {
                ...json,
                id: json.id,
                created_at: moment(snowflakeToDate(json.id)).format("ddd, DD/MM/YYYY, HH:mm:ss"),
                username: json.username,
                avatar: {
                    id: json.avatar,
                    link: avatarLink,
                    is_animated: json.avatar != null && json.avatar.startsWith("a_") ? true : false,
                },
                avatar_decoration: json.avatar_decoration_data,
                badges: publicFlags,
                premium_type: premiumTypes[json.premium_type],
                accent_color: json.accent_color,
                global_name: json.global_name,
                banner: {
                    id: json.banner,
                    link: bannerLink,
                    is_animated: json.banner != null && json.banner.startsWith("a_") ? true : false,
                    color: json.banner_color,
                },
                raw: json
            }
            
            userCache.set(userId, output);

        })
        .catch((err) => {
            throw new Error(err);
        });

        const value = userCache.get(userId);
        if (value == undefined) return;
        return value;
}