const axios = require("axios");
const NodeCache = require("node-cache");

const guildCache = new NodeCache({ stdTTL: 3600 });

export const getGuild = async (guildId) => {

    const cachedGuild = guildCache.get(guildId);
    if (cachedGuild == undefined) return;
    if (cachedGuild) return cachedGuild;

    await axios(`https://canary.discord.com/api/v10/guilds/${guildId}/widget.json`, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.data)
        .then(async (json) => {
            if (json.code && json.code === 50004) {
                throw new Error("The guild is either non-existant, unavailable, or has Server Widget/Discovery disabled.");
            }

            let output = {
                id: json.id,
                name: json.name,
                instant_invite: json.instant_invite,
                presence_count: json.presence_count
            }

            await guildCache.set(guildId, output);

        })
        .catch((err) => {
            throw err;
        });

        const value = await guildCache.get(guildId);
        if (value == undefined) return;
        return value;
}