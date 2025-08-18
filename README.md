# [discord-info-lookup](https://github.com/IdiotNaoki/discord-info-lookup)

This package utilises the Discord API to retrieve information about users and guilds using the user's or guild's ID. This reduces the hassle of directly interacting with Discord API and allows for easier retrieval of information. The package were originally made because I can't be assed to do it myself and I wanted to make it easier for others (and myself) to use this package.

## Installation

Using NPM:

```bash
npm install discord-info-lookup
```

Or using Bun:

```bash
bun install discord-info-lookup
```

## Usage

```js
const { getUser, getGuild } = require('discord-info-lookup');

const userInfo = await getUser('123456789012345678');
const guildInfo = await getGuild('123456789012345678');

console.log(userInfo); // { id: 123456789012, username: "username", ...}
console.log(guildInfo); // { id: 123456789012, name: "guild name", ...}
```

## Notes & Extras

- The output of both functions are in JSON format for easier parsing. The output of both functions are cached for 1 hour to reduce API calls made to the Discord API.

- For now, this package fetches your token by going through `process.env.TOKEN`. Don't worry, the token is not being stored nor sent anywhere. I will probably find some way to fetch it through some other ways in the case that you put your token at a different place.

- If you by any chance inputted anything that is not a number into either `getUser()` or `getGuild()`, it will throw an error telling you that numbers were expected. It may be a bit of a problem, but I don't want to make it too complicated. Do make sure the input contains only number in a string format though.

- I haven't tested the `getGuild()` function yet, but I'm sure it works. It also requires the server to be discoverable somewhat in order for it to actually work. Questions and suggestions are welcome.

- This package is not meant to be used for malicious purposes. The purpose of this package is to make it easier to retrieve information about users and guilds.

- If by any chance you encountered any issues, please create an issue on [Github](https://github.com/IdiotNaoki/discord-info-lookup/issues).