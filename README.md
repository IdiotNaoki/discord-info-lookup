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

- The output of both functions are in JSON format for easier parsing and the output is cached for 1 hour to reduce API calls made to the Discord API. The cache is reset everytime your app starts because the `node-cache` package stores the cache in memory. There shouldn't be any performance implications unless you fetch bazillions (not tested) of user/guilds in a short period of time.

- For now, this package (only `getUser()` function) fetches your token by going through `process.env.TOKEN`. It's used as a form of authorization to the Discord API to retrieve information. Don't worry, the token is not being stored nor sent anywhere. I will probably find a better way to fetch the token in the future.

- If you by any chance inputted anything that is not a number into either `getUser()` or `getGuild()`, it will throw an error telling you that numbers were expected. It may be a bit of a problem, but I don't want to make it too complicated. Do make sure the input contains only number in a string format though.

- I haven't tested the `getGuild()` function yet, but I'm sure it works. It also requires the server to be discoverable somewhat in order for it to actually work. Questions and suggestions are welcome.

- This package is not meant to be used for malicious purposes. The purpose of this package is to make it easier to retrieve information about users and guilds. Whatever you do with the information is up to you and I am not liable for any issues that may or may not occur if you use this package for malicious purposes.

- Please report any issues you encounter to [GitHub](https://github.com/IdiotNaoki/discord-info-lookup/issues). I will try my best to fix them as soon as possible.